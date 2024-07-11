import { Program, AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { PublicKey } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import escrow from '../idl/anchor_escrow.json';
import {
  AnchorWallet,
  ConnectionContextState,
} from '@solana/wallet-adapter-react';
import { AnchorEscrow } from "@/types";

export function getProgramInstance(
  connection: ConnectionContextState,
  wallet: AnchorWallet
): Program<AnchorEscrow> {
  if (!wallet.publicKey) throw new WalletNotConnectedError();

  const provider = new AnchorProvider(
    connection.connection,
    wallet,
    AnchorProvider.defaultOptions()
  );

  setProvider(provider);

  // Address of the deployed program.
  const programId = new PublicKey(
    '2MNyegmPXMsSjpHbtW1xFiPYgMPDKZjy3R2zhZm7Q6Qk'
  );

  // Generate the program client from IDL.
  const program = new Program<AnchorEscrow>(
    escrow as AnchorEscrow,
    provider
  );

  return program;
}
