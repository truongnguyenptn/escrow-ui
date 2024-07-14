'use client';
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid, Skeleton } from '@chakra-ui/react';
import Card from './EscrowCard';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import { EscrowAccount } from '@/types';
const Escrows = () => {
  const { getEscrowAccounts } = useEscrowProgram();
  const { data: escrowAccounts, isLoading } = getEscrowAccounts;

  useEffect(() => {
    getEscrowAccounts.refetch();
  }, []);

  if (escrowAccounts?.length === 0 && !isLoading) {
    return (
      <Box textAlign="center" my={10}>
        <Heading as="h2" size="xl" fontWeight="semibold">
          No escrows found
        </Heading>
      </Box>
    );
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} my={10}>
        {escrowAccounts?.map((escrow) => (
          <Skeleton key={escrow.publicKey.toString()} isLoaded={!isLoading}>
            <Card key={escrow.publicKey.toString()} data={escrow} />
          </Skeleton>
        ))}
      </SimpleGrid>
    </Skeleton>
  );
};

export default Escrows;
