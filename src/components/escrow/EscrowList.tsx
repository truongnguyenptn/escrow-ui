import React from 'react';
import { Box, Heading, SimpleGrid, Skeleton } from '@chakra-ui/react';
import Card from './EscrowCard';
import { EscrowAccount } from '@/types';

type Props = {
  escrowAccounts?: EscrowAccount[];
  isLoading: boolean;
};

const EscrowList = ({ escrowAccounts, isLoading }: Props) => {
  if (!isLoading && (!escrowAccounts || escrowAccounts.length === 0)) {
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

export default EscrowList;
