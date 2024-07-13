// Import global styles
import './globals.css';

// Import necessary modules
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '../providers/providers';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React, { Suspense } from 'react';

// Initialize Inter font with subsets
const inter = Inter({ subsets: ['latin'] });

// Define metadata for the page
export const metadata: Metadata = {
  title: 'The Escrow',
  description: 'Infuse your NFT to be cool & sustainable-proof',
};

// Define the RootLayout component
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Include Inter font */}
        <link rel="stylesheet" href={inter} />
      </head>
      <body>
        <Providers>
          {/* Render Navbar */}
          <Navbar />
          <Suspense
            fallback={
              <div className="text-center my-32">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            {/* Render children */}
            {children}
          </Suspense>
          {/* Render Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
