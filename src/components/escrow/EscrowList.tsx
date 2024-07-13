'use client';
import React, { useEffect, useState } from 'react';
import { Box, Heading, SimpleGrid } from '@chakra-ui/react';
import Card from './Card';
import SkeletonWrapper from '../SkeletonWrapper';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { EscrowAccount } from '@/types';
const Escrows = () => {
  const { getEscrowAccounts } = useEscrowProgram();
  const [escrowAccounts, setEscrowAccounts] = useState<EscrowAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEscrowAccounts = async () => {
      setIsLoading(true);
      try {
        const accounts = await getEscrowAccounts();
        setEscrowAccounts(accounts);
      } catch (error) {
        console.error('Error fetching escrow accounts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEscrowAccounts();
  }, []);

  if (escrowAccounts.length === 0 && !isLoading) {
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
      {/* <SkeletonWrapper isLoading={isLoading}> */}
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} my={10}>
        {escrowAccounts.map((escrow) => (
          <Card key={escrow.publicKey.toString()} data={escrow} />
        ))}
      </SimpleGrid>
      {/* </SkeletonWrapper> */}
    </Skeleton>
  );
};

export default Escrows;
