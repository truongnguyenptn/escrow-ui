import * as anchor from '@coral-xyz/anchor';
import {Keypair, PublicKey, Transaction} from '@solana/web3.js';

export type InfusedAccount = {
    nftMint: PublicKey;
    // owner: string;
    carbonScore: number;
    lastInfusedTime: anchor.BN;
};

export type LeaderBoardItem = {
    nftMint: string;
    carbonScore: number;
    imageUri?: string;
    name?: string;
    collection?: string;
    owner?: string;
};
