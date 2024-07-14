import { BN, Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import { randomBytes } from "crypto";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";
import escrowIDL from '../idl/anchor_escrow.json';
import { AnchorEscrow, EscrowAccount } from '@/types';
import { isToken2022 } from "@/lib";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function useEscrowProgram() {
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();
  const program = new Program<AnchorEscrow>(escrowIDL as AnchorEscrow, provider);
  const tokenProgram = TOKEN_PROGRAM_ID;
  const queryClient = useQueryClient();

  const getEscrowInfo = async (escrow: PublicKey) => {
    return program.account.escrow.fetch(escrow);
  };

  const createAssociatedTokenAccountIfNotExists = async (mint: PublicKey, owner: PublicKey, payer: PublicKey) => {
    const ata = getAssociatedTokenAddressSync(mint, owner, false, TOKEN_PROGRAM_ID);
    const accountInfo = await provider.connection.getAccountInfo(ata);
    if (!accountInfo) {
      const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
          payer,
          ata,
          owner,
          mint
        )
      );
      await provider.sendAndConfirm(transaction, []);
    }
    return ata;
  };

  const refundEscrow = useMutation({
    mutationKey: ['refundEscrow'],
    mutationFn: async ({ escrow }: {
      escrow: PublicKey
    }) => {
      if (!publicKey) return;
      const escrowAccount = await getEscrowInfo(escrow);

      const makerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrowAccount.maker,
        false,
        tokenProgram
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrow,
        true,
        tokenProgram
      );

      return program.methods
        .refund()
        .accountsPartial({
          mintA: new PublicKey(escrowAccount.mintA),
          vault,
          makerAtaA,
          escrow,
          tokenProgram,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEscrowAccounts'] });
    }
  });

  const takeEscrow = useMutation({
    mutationKey: ['takeEscrow'],
    mutationFn: async ({ escrow }: {
      escrow: PublicKey
    }) => {
      if (!publicKey) return;
      const escrowAccount = await getEscrowInfo(escrow);
      const tokenProgram = (await isToken2022(provider, escrowAccount.mintA))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        escrow,
        true,
        tokenProgram
      );

      const makerAtaB = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintB),
        escrowAccount.maker,
        false,
        tokenProgram
      );

      const takerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintA),
        publicKey,
        false,
        tokenProgram
      );

      const takerAtaB = getAssociatedTokenAddressSync(
        new PublicKey(escrowAccount.mintB),
        publicKey,
        false,
        tokenProgram
      );

      return program.methods
        .take()
        .accountsPartial({
          maker: escrowAccount.maker,
          taker: publicKey,
          mintA: new PublicKey(escrowAccount.mintA),
          mintB: new PublicKey(escrowAccount.mintB),
          makerAtaB,
          takerAtaA,
          takerAtaB,
          escrow,
          tokenProgram,
          vault,
        })
        .rpc();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEscrowAccounts'] });
    }
  });

  const getEscrowAccounts = useQuery({
    queryKey: ['getEscrowAccounts'],
    queryFn: async () => {
      const responses = await program.account.escrow.all() as EscrowAccount[];
      if (!publicKey) return responses;
      return responses.sort((a, b) => a.account.seed.cmp(b.account.seed));
    }
  });

  const getMyEscrowAccounts = useQuery({
    queryKey: ['getEscrowAccounts'],
    queryFn: async () => {
      const responses = await program.account.escrow.all() as EscrowAccount[];
      if (!publicKey) return responses;

      // Filter accounts where the maker matches the publicKey
      const filteredAccounts = responses.filter(account => account.account.maker.equals(publicKey));

      // Sort the filtered accounts if needed
      const sortedAccounts = filteredAccounts.sort((a, b) => a.account.seed.cmp(b.account.seed));

      return sortedAccounts;
    }
  });

  const makeNewEscrow = useMutation({
    mutationKey: ['makeNewEscrow'],
    mutationFn: async ({ mintA, mintB, deposit, receive }
      : { mintA: string, mintB: string, deposit: number, receive: number }
    ) => {
      if (!publicKey) return;
      const seed = new BN(randomBytes(8));

      const tokenProgram = (await isToken2022(provider, new PublicKey(mintA)))
        ? TOKEN_2022_PROGRAM_ID
        : TOKEN_PROGRAM_ID;

      const makerAtaA = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        publicKey,
        false,
        tokenProgram
      );

      const [escrow] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("escrow"),
          publicKey.toBuffer(),
          seed.toArrayLike(Buffer, "le", 8),
        ],
        program.programId
      );

      const vault = getAssociatedTokenAddressSync(
        new PublicKey(mintA),
        escrow,
        true,
        tokenProgram
      );

      try {
        const makerBalance = await provider.connection.getTokenAccountBalance(makerAtaA);
        if (makerBalance?.value?.uiAmount && makerBalance?.value?.uiAmount < deposit) {
          throw new Error("Insufficient funds in the maker's ATA");
        }

        const txid = await program.methods
          .make(seed, new BN(deposit), new BN(receive))
          .accounts({
            maker: publicKey,
            mintA: new PublicKey(mintA),
            mintB: new PublicKey(mintB),
            makerAtaA,
            vault,
            tokenProgram,
          })
          .rpc();

        console.log("Transaction submitted:", txid);

        const confirmation = await provider.connection.confirmTransaction(txid, "processed");
        console.log("Transaction confirmed:", confirmation);

        return txid;
      } catch (error) {
        console.error("Error creating escrow:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getEscrowAccounts'] });
    }
  });

  return {
    program,
    makeNewEscrow,
    getEscrowAccounts,
    takeEscrow,
    refundEscrow,
    getEscrowInfo,
    getMyEscrowAccounts
  };
}
