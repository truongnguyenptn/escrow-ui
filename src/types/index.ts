export * from './anchor-escrow';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface EscrowAccount {
  publicKey: PublicKey;
  account: {
    maker: PublicKey;
    taker: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    vault: PublicKey;
    makerAtaA: PublicKey;
    takerAtaA: PublicKey;
    makerAtaB: PublicKey;
    takerAtaB: PublicKey;
    deposit: BN;
    receive: BN;
    state: number;
    seed: BN;
    bump: number;
  };
  isOwner: boolean;
}

export interface TokenBalance {
  pubkey: string;
  balance: number;
  mint: string;
}

export interface TokenBalanceResponse {
  inAppTokens: TokenBalance[];
  onchainTokens: TokenBalance[];
}