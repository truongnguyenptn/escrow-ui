'use client';

import { Box, Text } from '@chakra-ui/react';
import { useEffect, useState, lazy, Suspense } from 'react';
import { InfusedAccount, LeaderBoardItem } from './InfusedAccount';

import { BaseInfusedAccount, loadedInfusedAccount } from './utils';
const DataTableBoard = lazy(() => import('./DataTableBoard'));

const Leaderboard = () => {
  const [accounts, setAccouts] = useState<LeaderBoardItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const baseInfusedAccount = async () => {
    let baseInfusedAccounts: BaseInfusedAccount[] = [];
    // if (program) {
    //   const accounts = await program.account.infusedAccount.all();
    //   const mappedAccounts = accounts.map(
    //     (account) => account.account as InfusedAccount
    //   );

    //   baseInfusedAccounts = mappedAccounts.map((account) => ({
    //     nftMint: account.nftMint.toString(),
    //     imageUri: 'images.png',
    //     name: 'unloaded name',
    //     collection: 'unloaded collection',
    //     owner: 'unloaded owner',
    //     carbonScore: account.carbonScore,
    //   }));
    // }

    return baseInfusedAccounts;
  };

  useEffect(() => {
    const loadAccounts = async () => {
      // if (program) {
      //   setIsLoading(true);
      //   const infusedAccounts = await baseInfusedAccount();
      //   const accountsWithMetadata = await Promise.all(
      //     infusedAccounts.map(
      //       async (account) => await loadedInfusedAccount(account)
      //     )
      //   );
      //   const filteredAccounts = accountsWithMetadata.reduce(
      //     (acc: LeaderBoardItem[], cur: LeaderBoardItem) => {
      //       if (!acc.map((a) => a.nftMint).includes(cur.nftMint)) {
      //         acc.push(cur);
      //       }
      //       return acc;
      //     },
      //     []
      //   );
      //   const sortedAccounts = filteredAccounts.sort(
      //     (accountA, accountB) => accountB.carbonScore - accountA.carbonScore
      //   );
      //   setAccouts(sortedAccounts);
      // }
    };

    loadAccounts();
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
      {accounts && <DataTableBoard accounts={accounts} />}
      {/* {accounts && (
        <div>
          {Object.keys(accounts).map((key) => {
            const data = accounts[key as unknown as number];
            return <div key={key}>{data.nftMint.toString()}</div>;
          })}
        </div>
      )} */}
    </Box>
  );
};

export default Leaderboard;
