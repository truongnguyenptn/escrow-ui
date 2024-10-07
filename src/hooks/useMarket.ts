import { BN, Idl, Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import { randomBytes } from "crypto";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import marketIDL from "../idl/dehype.json";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dehype } from "../types";
import { SystemProgram } from "@solana/web3.js";

export function useMarketProgram() {
  const provider = useAnchorProvider();
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const program = new Program(
    marketIDL as Idl,
    "GqroybDr5ep6GHJnk9XpmL6aamr7GRAsBQtSoy7SJwRV",
    provider,
  );
  const queryClient = useQueryClient();

  const getMarketInfo = async (market: PublicKey) => {
    // return program.account.market.fetch(market);
  };

  const createMarket = useMutation({
    mutationKey: ["createMarket"],
    mutationFn: async ({
      eventName,
      outcomeOptions,
    }: {
      eventName: string;
      outcomeOptions: string[];
    }) => {
      if (!publicKey) return;
      const seed = new BN(randomBytes(8));

      const [market] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("market"),
          publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId,
      );
      console.log("Market PDA:", market.toBase58());
      // Construct the transaction
      const transaction = await program.methods
        .createMarket(eventName, outcomeOptions)
        .accounts({
          market,
          user: publicKey,
          systemProgram: SystemProgram.programId,
        })
        .transaction();

      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Log the transaction details
      console.log("Transaction:", JSON.stringify(transaction));

      try {
        // Send the transaction using the wallet's sendTransaction method
        const signature = await sendTransaction(transaction, connection, {
          skipPreflight: true, // Skip preflight checks
          preflightCommitment: "confirmed", // Set preflight commitment level
        });

        console.log("Transaction Signature:", signature);

        // Construct and log the Solana Explorer URL
        const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=devnet`; // Change 'devnet' to your cluster
        console.log("View Transaction on Solana Explorer:", explorerUrl);

        return signature;
      } catch (error) {
        console.error("Transaction Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMarketAccounts"] });
    },
  });

  const getMarketAccounts = useQuery({
    queryKey: ["getMarketAccounts"],
    queryFn: async () => {
      const responses = await program.account.market.all();
      return responses.sort((a, b) => a.account.seed.cmp(b.account.seed));
    },
  });

  const getMyMarketAccounts = useQuery({
    queryKey: ["getMyMarketAccounts"],
    queryFn: async () => {
      if (!publicKey) {
        return []; // Return empty array if publicKey is not defined
      }

      const responses = await program.account.market.all();

      const filteredAccounts = responses.filter((account) =>
        account.account.user.equals(publicKey),
      );

      return filteredAccounts.sort((a, b) =>
        a.account.seed.cmp(b.account.seed),
      );
    },
  });

  return {
    program,
    createMarket,
    getMarketAccounts,
    getMyMarketAccounts,
    getMarketInfo,
  };
}
