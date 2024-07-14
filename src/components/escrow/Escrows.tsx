import React, { useEffect } from 'react';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import EscrowList from './EscrowList';

export const Escrows = () => {
  const { getEscrowAccounts } = useEscrowProgram();
  const { data: escrowAccounts, isLoading } = getEscrowAccounts;

  useEffect(() => {
    getEscrowAccounts.refetch();
  }, []);

  return <EscrowList escrowAccounts={escrowAccounts} isLoading={isLoading} />;
};
