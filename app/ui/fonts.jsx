import { Montserrat, Bokor, Lusitana } from 'next/font/google';

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['600', '300'],
});

export const bokor = Bokor({
  subsets: ['latin'],
  weight: ['400'],
});

export const lusitana = Lusitana({
  subsets: ['latin'],
  weight: ['400', '700'],
});
