'use client';

import { Box, Text, VStack } from '@chakra-ui/react';
import Escrows from '@/components/escrow/EscrowList';

const Home = () => {
  return (
    <Box
      maxW="7xl"
      mx="auto"
      minHeight="100vh"
      marginTop={50}
      px={{ base: '4', md: '8', lg: '10' }}
      py={{ base: '6', md: '8', lg: '10' }}
    >
      <VStack align="center" spacing={8}>
        <Text textAlign="center" fontSize="xl">
          Facilitate secure transactions on the Solana blockchain with the
          Escrow component. <br />
          We ensure both parties fulfill their obligations before assets are
          released.
        </Text>
        <Escrows />
      </VStack>
    </Box>
  );
};

export default Home;
