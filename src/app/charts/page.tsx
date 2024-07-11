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

const TakeFromEscrow = () => {
  const [escrowSeed, setEscrowSeed] = useState('');
  const [tokenAAmount, setTokenAAmount] = useState(0);
  const [tokenBAmount, setTokenBAmount] = useState(0);
  const [program, setProgram] = useState(null); // State to hold the program instance

  const takeFromEscrow = async () => {
    if (!program) return; // Ensure program instance is initialized
    try {
      await program.rpc.take(escrowSeed, tokenAAmount, tokenBAmount);
      console.log('Tokens taken from escrow successfully');
    } catch (error) {
      console.error('Error taking tokens from escrow:', error);
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
      const programInstance = await getProgramInstance(); // Assuming getProgramInstance fetches the instance
      setProgram(programInstance);
    };
    initializeProgram();
  }, []);

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
