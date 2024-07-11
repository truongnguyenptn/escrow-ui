'use client';

import {Button} from '@chakra-ui/react';
import {useWallet} from '@solana/wallet-adapter-react';
import {useWalletModal} from '@solana/wallet-adapter-react-ui';
import {useEffect} from 'react';

const DisconnectButton = () => {
    const {setVisible} = useWalletModal();
    const {wallet, connect, connecting, publicKey, disconnect} = useWallet();

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
        try {
            disconnect();
        } catch (error) {
            console.log(
                'Error connecting to the wallet: ',
                (error as any).message
            );
        }
    };

    return (
        <Button
            className="btn btn-primary btn-lg"
            onClick={handleWalletClick}
            disabled={connecting}
            colorScheme="aquamarine">
            <div>Disconnect</div>
        </Button>
    );
};

export default DisconnectButton;
