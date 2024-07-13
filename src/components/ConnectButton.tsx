'use client';
import dynamic from 'next/dynamic';
require('@solana/wallet-adapter-react-ui/styles.css');
const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

export default function ConnectWalletButton() {
  return <WalletMultiButtonDynamic className="connect-wallet" />;
}
