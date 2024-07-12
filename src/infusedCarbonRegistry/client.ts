import * as anchor from '@coral-xyz/anchor';
import { Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { InfusedCarbonRegistry } from './types';

export const infuse = async (
    // program: anchor.Program<InfusedCarbonRegistry>,
    // amount: anchor.BN,
    // nftMint: PublicKey
) => {
    // const holdingAccount = new PublicKey(
    //     '3bQhuVsa1sU5mZYJYmpWAN9jLNCM5xxk2RNtrqehfYuh'
    // );
    // const feesAccount = new PublicKey(
    //     '735WcMTFNG3qXQat7VP2uxMpSvts969xg5vnKPiDpsp9'
    // );
    // const [globalRegistry] = PublicKey.findProgramAddressSync(
    //     [anchor.utils.bytes.utf8.encode('global-registry')],
    //     program.programId
    // );
    // const [infusedAccount] = PublicKey.findProgramAddressSync(
    //     [anchor.utils.bytes.utf8.encode('infused-account'), nftMint.toBytes()],
    //     program.programId
    // );

    //     try {
    //         // const transactionSignature = await program.methods
    //         //     .infuse(amount)
    //         //     .accounts({
    //         //         globalRegistry,
    //         //         feesAccount,
    //         //         holdingAccount,
    //         //         nftMint,
    //         //         infusedAccount,
    //         //         systemProgram: anchor.web3.SystemProgram.programId
    //         //     })
    //             .rpc();
    // console.log('tx: ', transactionSignature);
    //     } catch (e) {
    //     console.log(e);
    // }
};
