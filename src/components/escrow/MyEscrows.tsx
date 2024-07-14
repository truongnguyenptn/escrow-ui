import React, { useEffect } from 'react';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import EscrowList from './EscrowList';

export const MyEscrows = () => {
  const { getMyEscrowAccounts } = useEscrowProgram();
  const { data: myEscrowAccounts, isLoading } = getMyEscrowAccounts;

  useEffect(() => {
    getMyEscrowAccounts.refetch();
  }, []);

  return <EscrowList escrowAccounts={myEscrowAccounts} isLoading={isLoading} />;
};
