import '../app/ui/global.css';
import { montserrat } from './ui/fonts';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    // en cada pagina remplaza el %S por el nombre
    template: '%s | Next-Js 14',
    default: 'Curso oficial Next-Js 14',
  },
  description: 'The official Next.js Learn Dashboard built with App Router.',
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${montserrat.className} antialiased`}>
        {children}

        <footer className=" flex w-full items-center justify-center">
          <h1>Aprendiendo next js 14 🤓</h1>
        </footer>
      </body>
    </html>
  );
}
