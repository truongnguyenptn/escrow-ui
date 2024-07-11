'use client';
import React, { useEffect, useState } from 'react';
import { Box, Button } from '@chakra-ui/react';
import { getProgramInstance } from '@/escrow/program'; // Assuming this file contains getProgramInstance function

const RefundEscrow = () => {
  const [program, setProgram] = useState(null); // State to hold the program instance

  const refundEscrow = async () => {
    if (!program) return; // Ensure program instance is initialized
    try {
      await program.rpc.refund();
      console.log('Escrow refunded successfully');
    } catch (error) {
      console.error('Error refunding escrow:', error);
    }
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
      <Button colorScheme="teal" onClick={refundEscrow}>
        Refund Escrow
      </Button>
    </Box>
  );
};

export default RefundEscrow;
