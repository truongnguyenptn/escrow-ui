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
import { TokenBalance } from '@/types';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Formik, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import { splBalances } from '@/lib';

const MakeEscrow = () => {
  const [tokenAccounts, setTokenAccounts] = useState<TokenBalance[]>([]);
  const { makeNewEscrow: make } = useEscrowProgram();
  const connection = useConnection();
  const wallet = useWallet();

  useEffect(() => {
    if (wallet.connected) {
      fetchTokenAccounts();
    }
  }, [connection, wallet]);

  const fetchTokenAccounts = async () => {
    if (!wallet.publicKey) return;

    try {
      const res = await splBalances(wallet.publicKey.toString());
      const tokenAccountsArray = res.onchainTokens.map(
        ({ pubkey, balance, mint }) => ({
          pubkey,
          balance,
          mint,
        })
      );

      setTokenAccounts(tokenAccountsArray);
    } catch (error) {
      console.error('Error fetching token accounts:', error);
    }
  };

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

  const makeEscrow = async (values: {
    escrowSeed?: string;
    tokenADeposit: number;
    tokenBReceive: number;
    mintA: string;
    mintB: string;
  }) => {
    try {
      const { tokenADeposit, tokenBReceive, mintA, mintB } = values;
      console.log('ok');
      await make({
        mint_a: mintA,
        mint_b: mintB,
        deposit: tokenADeposit,
        receive: tokenBReceive,
      });
      console.log('Escrow created successfully');
    } catch (error) {
      console.error('Error creating escrow:', error);
    }
  };

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
        onSubmit={(values, actions) => {
          makeEscrow(values);
          actions.setSubmitting(false);
        }}
      >
        {({
          values,
          handleChange,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          resetForm,
        }) => (
          <Form onSubmit={handleSubmit}>
            <VStack spacing={4} align="start">
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
                onClick={() => {
                  resetForm();
                }}
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
