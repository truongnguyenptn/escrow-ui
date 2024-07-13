import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers/providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React, { PropsWithChildren, Suspense } from "react";
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'The Escrow',
  description: 'Infuse your NFT to be cool & sustainable-proof',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <Suspense
        fallback={
          <div className="text-center my-32">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        }
          {children}
          </Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
