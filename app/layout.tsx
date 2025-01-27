// app/layout.tsx
import React from 'react';
import Image from 'next/image';
import '../globals.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#093545] text-white font-montserrat flex flex-col items-center justify-center relative">
        {children}
        <ToastContainer />
         <div className="absolute bottom-0 w-full overflow-hidden">
          <picture>
            <source srcSet="/svgs/curve-m.svg" media="(max-width: 768px)" />
            <Image src="/svgs/curve.svg" alt="Curves" layout="intrinsic" width={1440} height={320} className="w-full md:h-auto" priority />
          </picture>
        </div>
      </body>
    </html>
  );
}