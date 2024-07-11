// import { useEffect } from "react";
// import { useWorkspace } from "../providers/ContextProvider";

// const useInfuseTx = (amount: number) => {
//   const workspace = useWorkspace();
//   const program = workspace.program;

//   useEffect(() => {
//     const tx = await program?.methods.infuse(amount).accounts({state, feesAccount, holdingAccount}).rpc();
//   }, []);
//   return { tx };
// };
