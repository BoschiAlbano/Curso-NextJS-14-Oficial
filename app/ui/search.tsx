'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// ❌ proyecto anterior con next js.
// [cadena].jsx
// const router = useRouter();
// const { cadena } = router.query;

export default function Search({ placeholder }: { placeholder: string }) {
  // ❗ Recuperar los serchparams desde el cliente

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  // ❗ Debounced: toma el timepo que tarda en presionar la letras
  const handlesearch = useDebouncedCallback((term: string) => {
    // Obtiene todos los parametros de la url no tandosolo el query.
    const params = new URLSearchParams(searchParams);

    // Compueba si hay o no term
    if (term) {
      params.set('query', term);
      params.set('currentPage', '1');
    } else {
      params.delete('query');
      params.delete('currentPage');
    }
    // remplaza la url
    replace(`${pathname}?${params.toString()}`);
  }, 500);

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        onChange={(e) => handlesearch(e.target.value)}
        defaultValue={searchParams.get('query')?.toString()} // obtenemos los parametros
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
  );
}
