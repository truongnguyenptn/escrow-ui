'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  VStack,
  HStack,
  Select,
} from '@chakra-ui/react';
import { getProgramInstance } from '@/escrow/program'; // Assuming this file contains getProgramInstance function
import { BN, Program } from '@coral-xyz/anchor';
import { AnchorEscrow } from '@/types';
import { PublicKey } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { logSignature, Position, splBalances } from '../utils';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { randomBytes } from 'crypto';

const MakeEscrow = () => {
  const [tokenAccounts, setTokenAccounts] = useState<Position[]>([]);
  const [program, setProgram] = useState<Program<AnchorEscrow>>();
  const connection = useConnection();
  const wallet = useWallet();
  const seed = new BN(randomBytes(8));

  const fetchTokenAccounts = async () => {
    if (!wallet.publicKey) return;

    try {
      const res = await splBalances(wallet.publicKey.toString());
      const tokenAccountsArray = res.onchainPositions.map(
        ({ pubkey, balance, mint }) => ({
          pubkey,
          balance,
          mint,
        })
      );

      setTokenAccounts(tokenAccountsArray);
      console.log('tokenAccounts', tokenAccountsArray);
    } catch (error) {
      console.error('Error fetching token accounts:', error);
    }
  };

  const makeEscrow = async (values) => {
    if (!program || !wallet) return;

    try {
      const { escrowSeed, tokenADeposit, tokenBReceive, mintA, mintB } = values;
      const userAccountPublicKey = wallet.publicKey;
      if (!userAccountPublicKey) return;

      console.log({ mintA, mintB });

      const mintAPublicKey = new PublicKey(mintA);
      const mintBPublicKey = new PublicKey(mintB);

      const makerAtaAPublicKey = await getAssociatedTokenAddress(
        mintAPublicKey,
        userAccountPublicKey
      );
      const makerAtaBPublicKey = await getAssociatedTokenAddress(
        mintAPublicKey,
        userAccountPublicKey
      );
      const vaultPublicKey = await getAssociatedTokenAddress(
        mintAPublicKey,
        userAccountPublicKey,
        true
      );

      const escrow = PublicKey.findProgramAddressSync(
        [
          Buffer.from('escrow'),
          userAccountPublicKey.toBuffer(),
          new BN(seed).toArrayLike(Buffer, 'le', 8),
        ],
        new PublicKey('2MNyegmPXMsSjpHbtW1xFiPYgMPDKZjy3R2zhZm7Q6Qk')
      )[0];
      console.log({
        maker: userAccountPublicKey.toString(),
        mintA: mintAPublicKey.toString(),
        mintB: mintBPublicKey.toString(),
        makerAtaA: makerAtaAPublicKey.toString(),
        vault: vaultPublicKey.toString(),
        escrow: escrow.toString(),
        associatedTokenProgram: new PublicKey(
          'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
        ).toString(),
        systemProgram: '11111111111111111111111111111111',
        tokenProgram: TOKEN_2022_PROGRAM_ID.toString(),
      });
      await program.methods
        .make(new BN(seed), new BN(tokenADeposit), new BN(tokenBReceive))
        .accounts({
          maker: userAccountPublicKey,
          mintA: mintAPublicKey,
          mintB: mintBPublicKey,
          vault: vaultPublicKey,
          makerAtaA: makerAtaAPublicKey,
          associatedTokenProgram: new PublicKey(
            'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL'
          ),
          tokenProgram: TOKEN_PROGRAM_ID,
          // systemProgram: '11111111111111111111111111111111',
          // taker: userAccountPublicKey,
          // makerAtaB: makerAtaBPublicKey,
          // takerAtaA: makerAtaAPublicKey,
          // takerAtaB: vaultPublicKey,
        })
        .signers([])
        .rpc({
          skipPreflight: false,
        })
        .then(confirm)
        .then(logSignature);

      console.log('Escrow created successfully');
    } catch (error) {
      console.error('Error creating escrow:', error);
    }
  };

  useEffect(() => {
    const initializeProgram = async () => {
      if (!wallet.publicKey) return;
      const programInstance = getProgramInstance(connection, wallet);
      setProgram(programInstance);
    };

    if (wallet && wallet.connected) {
      initializeProgram();
      fetchTokenAccounts();
    }
  }, [connection, wallet]);

  const initialValues = {
    escrowSeed: '',
    tokenADeposit: 0,
    tokenBReceive: 0,
    mintA: '',
    mintB: '',
  };

  const validationSchema = Yup.object({
    escrowSeed: Yup.string().required('Required'),
    tokenADeposit: Yup.number()
      .required('Required')
      .min(1, 'Must be greater than 0'),
    tokenBReceive: Yup.number()
      .required('Required')
      .min(1, 'Must be greater than 0'),
    mintA: Yup.string().required('Required'),
    mintB: Yup.string().required('Required'),
  });

  return (
    <Box
      maxW="7xl"
      mx="auto"
      minHeight="100vh"
      marginTop={50}
      px={{ base: '4', md: '8', lg: '10' }}
      py={{ base: '6', md: '8', lg: '10' }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values, actions) => {
          makeEscrow(values);
          actions.setSubmitting(false);
          actions.resetForm();
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
        }) => (
          <Form onSubmit={handleSubmit}>
            <VStack spacing={4} align="start">
              <FormControl>
                <FormLabel>Escrow Seed</FormLabel>
                <Input
                  name="escrowSeed"
                  value={values.escrowSeed}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Token A Deposit</FormLabel>
                <Input
                  type="number"
                  name="tokenADeposit"
                  value={values.tokenADeposit}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Token B Receive</FormLabel>
                <Input
                  type="number"
                  name="tokenBReceive"
                  value={values.tokenBReceive}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Token A Mint</FormLabel>
                <Select
                  name="mintA"
                  value={values.mintA}
                  onChange={(e) => setFieldValue('mintA', e.target.value)}
                >
                  {tokenAccounts.map(({ pubkey, balance, mint }) => (
                    <option key={pubkey} value={mint}>
                      {mint} - {balance}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Token B Mint</FormLabel>
                <Select
                  name="mintB"
                  value={values.mintB}
                  onChange={(e) => setFieldValue('mintB', e.target.value)}
                >
                  {tokenAccounts.map(({ pubkey, balance, mint }) => (
                    <option key={pubkey} value={mint}>
                      {mint} - {balance}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
            <HStack justify="space-between" mt={4}>
              <Button
                colorScheme="teal"
                type="reset"
                onClick={() => handleReset()}
              >
                Reset
              </Button>
              <Button colorScheme="teal" type="submit" isLoading={isSubmitting}>
                Make Escrow
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MakeEscrow;
