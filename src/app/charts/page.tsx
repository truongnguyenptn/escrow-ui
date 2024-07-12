'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { getProgramInstance } from '@/escrow/program'; // Assuming this file contains getProgramInstance function
import { Program } from '@coral-xyz/anchor';
import { AnchorEscrow } from '@/types';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react';

const TakeFromEscrow = () => {
  const [escrowSeed, setEscrowSeed] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);
  const [program, setProgram] = useState<Program<AnchorEscrow>>(); // State to hold the program instance
  const connection = useConnection();
  const wallet = useAnchorWallet();
  const takeFromEscrow = async () => {
    if (!program) return; // Ensure program instance is initialized

    try {
      // Replace with actual public keys
      const userAccountPublicKey = new PublicKey(
        'YOUR_USER_ACCOUNT_PUBLIC_KEY'
      );

      const takerAtaAPublicKey = new PublicKey('YOUR_TAKER_ATA_A_PUBLIC_KEY');
      const takerAtaBPublicKey = new PublicKey('YOUR_TAKER_ATA_B_PUBLIC_KEY');
      const makerAtaBPublicKey = new PublicKey('YOUR_MAKER_ATA_B_PUBLIC_KEY');

      await program.methods
        .take()
        .accounts({
          taker: userAccountPublicKey,
          takerAtaA: takerAtaAPublicKey,
          takerAtaB: takerAtaBPublicKey,
          makerAtaB: makerAtaBPublicKey,
          vault: new PublicKey('YOUR_VAULT_PUBLIC_KEY'), // Replace with actual vault public key
          tokenProgram: new PublicKey('TOKEN_PROGRAM_ID'), // Replace with actual token program ID
        })
        .signers([
          /* specify any signers if required */
        ])
        .rpc();
    } catch (error) {
      console.error('Error taking from escrow:', error);
    }
  };

  const handleReset = () => {
    setEscrowSeed('');
    setTokenAAmount(0);
    setTokenBAmount(0);
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
      <VStack spacing={4} align="start">
        <FormControl>
          <FormLabel>Escrow Seed</FormLabel>
          <Input
            value={escrowSeed}
            onChange={(e) => setEscrowSeed(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Token A Amount</FormLabel>
          <Input
            type="number"
            value={tokenAAmount}
            onChange={(e) => setTokenAAmount(Number(e.target.value))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Token B Amount</FormLabel>
          <Input
            type="number"
            value={tokenBAmount}
            onChange={(e) => setTokenBAmount(Number(e.target.value))}
          />
        </FormControl>
      </VStack>
      <HStack justify="space-between" mt={4}>
        <Button colorScheme="teal" onClick={handleReset}>
          Reset
        </Button>
        <Button colorScheme="teal" onClick={takeFromEscrow}>
          Take from Escrow
        </Button>
      </HStack>
    </Box>
  );
};

export default TakeFromEscrow;
