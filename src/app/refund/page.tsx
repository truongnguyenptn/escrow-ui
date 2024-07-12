'use client';
import React, { useState, useEffect } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { getProgramInstance } from '@/escrow/program'; // Assuming this file contains getProgramInstance function
import { Program } from '@coral-xyz/anchor';
import { AnchorEscrow } from '@/types';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';

const RefundEscrow = () => {
  const [program, setProgram] = useState<Program<AnchorEscrow>>(); // State to hold the program instance
  const connection = useConnection();
  const wallet = useAnchorWallet();

  const refundEscrow = async () => {
    if (!program) return; // Ensure program instance is initialized
    try {
      const makerAtaAPublicKey = new PublicKey('YOUR_MAKER_ATA_A_PUBLIC_KEY');

      await program.methods
        .refund()
        .accounts({
          makerAtaA: makerAtaAPublicKey,
          vault: new PublicKey('YOUR_VAULT_PUBLIC_KEY'), // Replace with actual vault public key
          tokenProgram: new PublicKey('TOKEN_PROGRAM_ID'), // Replace with actual token program ID
        })
        .signers([
          /* specify any signers if required */
        ])
        .rpc();

      console.log('Escrow refunded successfully');
    } catch (error) {
      console.error('Error refunding escrow:', error);
    }
  };

  // Initialize program instance on component mount
  useEffect(() => {
    const initializeProgram = async () => {
      const programInstance = getProgramInstance(connection, wallet); // Assuming getProgramInstance fetches the instance
      setProgram(programInstance);
    };
    initializeProgram();
  }, [connection, wallet]);

  return (
    <Box
      maxW="7xl"
      mx="auto"
      minHeight="100vh"
      marginTop={50}
      px={{ base: '4', md: '8', lg: '10' }}
      py={{ base: '6', md: '8', lg: '10' }}
    >
      <Button colorScheme="teal" onClick={refundEscrow}>
        Refund Escrow
      </Button>
    </Box>
  );
};

export default RefundEscrow;
