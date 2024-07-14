'use client';

import { Box, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { MyEscrows } from '@/components/escrow';

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
          Your owned escrows
        </Text>
        <MyEscrows />
      </VStack>
    </Box>
  );
};

export default Home;
