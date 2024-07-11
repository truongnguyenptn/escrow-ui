'use client';

import { Button } from '@chakra-ui/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useEffect } from 'react';

const ConnectButton = ({
  onUseWalletClick,
}: {
  onUseWalletClick: () => void;
}) => {
  const { setVisible } = useWalletModal();
  const { wallet, connect, connecting, publicKey } = useWallet();

  useEffect(() => {
    if (!publicKey && wallet) {
      try {
        connect();
      } catch (error) {
        console.log(
          'Error connecting to the wallet: ',
          (error as any).message
        );
      }
    }
  }, [connect, publicKey, wallet]);

  const handleWalletClick = () => {
    console.log('Test');
    try {
      if (!wallet) {
        setVisible(true);
      } else {
        connect();
      }
      onUseWalletClick();
    } catch (error) {
      console.log(
        'Error connecting to the wallet: ',
        (error as any).message
      );
    }
  };

  const connectButton = () => {
    return (
      <Button
        onClick={handleWalletClick}
        disabled={connecting}
        colorScheme='aquamarine'
      >
        <div>Connect Wallet</div>
      </Button>
    );
  };

  const walletButton = () => {
    return (
      <Button
        onClick={handleWalletClick}
        disabled={connecting}
        colorScheme='gray'
      >
        <div>{publicKey?.toBase58().substring(0, 6)}...</div>
      </Button>
    );
  };

  return <>{publicKey ? walletButton() : connectButton()}</>;
};

export default ConnectButton;
