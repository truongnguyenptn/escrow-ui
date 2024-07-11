// import * as anchor from '@coral-xyz/anchor';
// import { useEffect, useState } from 'react';
// import { InfusedCarbonRegistry } from '../infusedCarbonRegistry/types';
// import {
//   InfusedAccount,
//   LeaderBoardItem,
// } from '../leaderboard/InfusedAccount';
// import { useWorkspace } from '../providers/ContextProvider';

// // const program = anchor.workspace
// //   .InfusedCarbonRegistry as anchor.Program<InfusedCarbonRegistry>;

// const useInfusedAccounts = () => {
//   const [data, setData] = useState<any>(null);
//   const [isLoaded, setIsLoaded] = useState(false);
//   const [error, setError] = useState(null);
//   const workspace = useWorkspace();
//   const program = workspace.program;

//   //   if (!program) {
//   //     alert('Please connect your wallet!');
//   //     return;
//   //   }

//   useEffect(() => {
//     const load = async () => {
//       if (!program) return [];
//       const accounts = await program.account.infusedAccount.all();

//       setData(accounts);
//     };

//     load();
//   }, []);

//   return { error, isLoaded, data };
// };

// export default useInfusedAccounts;
