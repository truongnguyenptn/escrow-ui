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

const MakeEscrow = () => {
  const [escrowSeed, setEscrowSeed] = useState('');
  const [tokenADeposit, setTokenADeposit] = useState(0);
  const [tokenBReceive, setTokenBReceive] = useState(0);
  const [program, setProgram] = useState<Program<AnchorEscrow>>(); // State to hold the program instance
  const connection = useConnection();
  const wallet = useAnchorWallet();

  const makeEscrow = async () => {
    if (!program || !wallet) return; // Ensure program instance and wallet are initialized

    try {
      const userAccountPublicKey = wallet.publicKey;
      const makerAtaAPublicKey = new PublicKey('YOUR_MAKER_ATA_A_PUBLIC_KEY'); // Replace with actual ATA for token A
      const mintAPublicKey = new PublicKey('YOUR_MINT_A_PUBLIC_KEY'); // Replace with actual mint A public key
      const mintBPublicKey = new PublicKey('YOUR_MINT_B_PUBLIC_KEY'); // Replace with actual mint B public key

      await program.methods
        .make(new PublicKey(escrowSeed), tokenADeposit, tokenBReceive)
        .accounts({
          maker: userAccountPublicKey,
          mintA: mintAPublicKey,
          mintB: mintBPublicKey,
          makerAtaA: makerAtaAPublicKey,
          vault: new PublicKey('YOUR_VAULT_PUBLIC_KEY'), // Replace with actual vault public key
          tokenProgram: new PublicKey('TOKEN_PROGRAM_ID'), // Replace with actual token program ID
        })
        .signers([])
        .rpc();
    } catch (error) {
      console.error('Error creating escrow:', error);
    }
  };

  const handleReset = () => {
    setEscrowSeed('');
    setTokenADeposit(0);
    setTokenBReceive(0);
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
          <FormLabel>Token A Deposit</FormLabel>
          <Input
            type="number"
            value={tokenADeposit}
            onChange={(e) => setTokenADeposit(Number(e.target.value))}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Token B Receive</FormLabel>
          <Input
            type="number"
            value={tokenBReceive}
            onChange={(e) => setTokenBReceive(Number(e.target.value))}
          />
        </FormControl>
      </VStack>
      <HStack justify="space-between" mt={4}>
        <Button colorScheme="teal" onClick={handleReset}>
          Reset
        </Button>
        <Button colorScheme="teal" onClick={makeEscrow}>
          Make Escrow
        </Button>
      </HStack>
    </Box>
  );
};

export default MakeEscrow;
