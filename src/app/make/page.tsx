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
import { logSignature, Position, splBalances } from '@/lib';
import {
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  getOrCreateAssociatedTokenAccount,
} from '@solana/spl-token';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { randomBytes } from 'crypto';
import useAnchorProvider from '@/hooks/useAnchorProvider';
import useEscrowProgram from '@/hooks/useEscrowProgram';

const MakeEscrow = () => {
  const [tokenAccounts, setTokenAccounts] = useState<Position[]>([]);
  const [program, setProgram] = useState<Program<AnchorEscrow>>();
  const connection = useConnection();
  const wallet = useWallet();
  const seed = new BN(randomBytes(8));
  const provider = useAnchorProvider();
  const { makeNewEscrow: make } = useEscrowProgram();
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
      const { tokenADeposit, tokenBReceive, mintA, mintB } = values;
      make({
        mint_a: mintA,
        mint_b: mintB,
        deposit: tokenADeposit,
        deposit: tokenBReceive,
      });
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
