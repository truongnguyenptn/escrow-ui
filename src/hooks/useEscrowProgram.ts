import { BN, Program } from "@coral-xyz/anchor";
import useAnchorProvider from "./useAnchorProvider";
import { randomBytes } from "crypto";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import escrowIDL from '../idl/anchor_escrow.json';
import { AnchorEscrow, EscrowAccount } from '@/types';

export default function useEscrowProgram() {
  const provider = useAnchorProvider();
  const { publicKey } = useWallet();
  const program = new Program<AnchorEscrow>(escrowIDL as AnchorEscrow, provider);
  const tokenProgram = TOKEN_PROGRAM_ID; //TOKEN_2022_PROGRAM_ID;

  const getEscrowInfo = async (escrow: PublicKey) => {
    return program.account.escrow.fetch(escrow);
  };

  const refundEscrow = async (params: { escrow: PublicKey }) => {
    if (!publicKey) return;
    const { escrow } = params;
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
      .accounts({
        vault,
        makerAtaA,
        tokenProgram,
      })
      .rpc();
  };

  const takeAEscrow = async (params: { escrow: PublicKey }) => {
    if (!publicKey) return;
    const { escrow } = params;
    const escrowAccount = await getEscrowInfo(escrow);

    const [vault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), escrow.toBuffer(), publicKey.toBuffer()],
      program.programId
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
  };

  const getEscrowAccounts = async () => {
    const responses = await program.account.escrow.all() as EscrowAccount[];
    if (!publicKey) return responses;

    const ownershipChecks = responses.map(async (escrow) => {
      const isOwner = await escrow.account.maker.equals(publicKey);
      return {
        ...escrow,
        isOwner,
      };
    });

    // Resolve all promises
    const escrowAccounts = await Promise.all(ownershipChecks);

    return escrowAccounts.sort((a, b) => a.account.seed.cmp(b.account.seed));
  };

  const makeNewEscrow = async (params: {
    mint_a: string;
    mint_b: string;
    deposit: number;
    receive: number;
  }) => {
    if (!publicKey) return;
    const seed = new BN(randomBytes(8));
    const { mint_a, mint_b, deposit, receive } = params;

    const makerAtaA = getAssociatedTokenAddressSync(
      new PublicKey(mint_a),
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
      new PublicKey(mint_a),
      escrow,
      true,
      tokenProgram
    );

    try {
      // Check the balance of the maker's ATA before proceeding
      const makerBalance = await provider.connection.getTokenAccountBalance(makerAtaA);
      if (makerBalance?.value?.uiAmount && makerBalance?.value?.uiAmount < deposit) {
        throw new Error("Insufficient funds in the maker's ATA");
      }

      const txid = await program.methods
        .make(seed, new BN(deposit), new BN(receive))
        .accounts({
          maker: publicKey,
          mintA: new PublicKey(mint_a),
          mintB: new PublicKey(mint_b),
          makerAtaA,
          vault,
          tokenProgram,
        })
        .rpc();

      console.log("Transaction submitted:", txid);

      // Await transaction confirmation
      const confirmation = await provider.connection.confirmTransaction(txid, "processed");
      console.log("Transaction confirmed:", confirmation);

      return txid; // Return transaction ID if needed
    } catch (error) {
      console.error("Error creating escrow:", error);
      throw error; // Rethrow the error for handling in the caller function
    }
  };

  return {
    program,
    makeNewEscrow,
    getEscrowAccounts,
    takeAEscrow,
    refundEscrow,
  };
}
