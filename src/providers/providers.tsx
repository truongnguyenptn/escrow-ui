// app/providers.tsx
'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletProvider,
  ConnectionProvider,
} from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { useMemo } from 'react';
import { Global } from '@emotion/react';

const Fonts = () => (
  <Global
    styles={`
      /* latin */
      @font-face {
        font-family: 'pokemon-font';
  src: url('/fonts/pokemon-font.woff2') format('woff2')
      }
      `}
  />
);

export default Fonts;

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    aquamarine: {
      50: 'f7fafc',
      100: '#f7fafc',
      200: '#6AFFAE',
      450: '#6AFFAE',
      600: '#6AFFAE',
      // ...
      900: '#1a202c',
    },
  },
  fonts: {
    body: 'pokemon-font, monospace',
  },
  styles: {
    global: () => ({
      body: {
        bg: 'gray.800',
      },
    }),
  },
});

const RPC_URL = String(process.env.NEXT_PUBLIC_RPC_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => RPC_URL, []);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode="dark" />
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <Fonts />
            <WalletModalProvider>{children}</WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </ChakraProvider>
    </CacheProvider>
  );
}
