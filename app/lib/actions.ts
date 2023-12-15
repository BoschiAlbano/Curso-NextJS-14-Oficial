'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';

const CreateInvoicesSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: 'Please select a customer.',
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

const CreateInvoicesFormSchema = CreateInvoicesSchema.omit({
  id: true,
  date: true,
});

export type State = {
  errors?: {
    customerId?: string[];
    amount?: string[];
    status?: string[];
  };
  message?: string | null;
};

// Insertar

export async function createInvoice(prevState: State, formData: FormData) {
  // extrar todos los campos
  console.log(formData);
  const rawFormData = Object.fromEntries(formData.entries());
  console.log(rawFormData);

  // Validar Campos
  const _DatosValidados = CreateInvoicesFormSchema.safeParse(rawFormData);

  // si se valida correctamente obtengo 'data'
  if (!_DatosValidados.success) {
    return {
      errors: _DatosValidados.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }
  // dos atributos mas
  const amountInCentes = _DatosValidados.data.amount * 100;
  const [date] = new Date().toISOString().split('T');

  // base de datos
  try {
    // throw new Error();

    await sql`
              INSERT INTO invoices (customer_id, amount, status, date)
              VALUES (${_DatosValidados.data.customerId}, ${amountInCentes}, ${_DatosValidados.data.status}, ${date})
          `;
  } catch (error: any) {
    return {
      message: '¡Algo salió mal, en la base de datos.',
    };
  }

  // revalidar y volver a traer los datos si no usa la de cache
  revalidatePath('/dashboard/invoices');
  // cambiar a invoices
  redirect('/dashboard/invoices');

  // throw new Error('¡Algo salió mal!');
}

// Actualizar

export async function updateInvoice(
  id: string,
  prevState: State,
  formData: FormData,
) {
  const rawFormData = Object.fromEntries(formData.entries());

  console.log(id);
  console.log(rawFormData);

  const _DatosValidados = CreateInvoicesFormSchema.safeParse(rawFormData);

  if (!_DatosValidados.success) {
    return {
      errors: _DatosValidados.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create Invoice.',
    };
  }

  const amountInCents = _DatosValidados.data.amount * 100;

  try {
    await sql`
  UPDATE invoices
  SET customer_id = ${_DatosValidados.data.customerId}, amount = ${amountInCents}, status = ${_DatosValidados.data.status}
  WHERE id = ${id}
  `;
  } catch (error) {
    return { message: 'Database Error: Failed to Update Invoice.' };
  }

  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

export type StateEliminar = {
  message?: string | null;
};

// Eliminar
export async function dedleteInvoice(id: string, prevState: StateEliminar) {
  console.log(id);

  try {
    await sql`DELETE FROM invoices WHERE id = ${id}`;

    revalidatePath('/dashboard/invoices');

    return { message: 'Eliminado con Existo' };
  } catch (error: any) {
    return { message: error.message };
  }
}

// NextAuth
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
