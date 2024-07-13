'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  Select,
  useToast,
  HStack,
  VStack,
} from '@chakra-ui/react';
import { TokenBalance } from '@/types';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import { getSplBalances } from '@/lib';

type Props = {
  onFinished: () => void;
};
const MakeEscrow = ({ onFinished }: Props) => {
  const [tokenAccounts, setTokenAccounts] = useState<TokenBalance[]>([]);
  const [initialValues, setInitialValues] = useState({
    tokenADeposit: 0,
    tokenBReceive: 0,
    mintA: '',
    mintB: '',
  });

  const { makeNewEscrow } = useEscrowProgram();
  const connection = useConnection();
  const wallet = useWallet();
  const toast = useToast();

  useEffect(() => {
    if (wallet.connected) {
      fetchTokenAccounts();
    }
  }, [connection, wallet]);

  const fetchTokenAccounts = async () => {
    if (!wallet.publicKey) return;

    try {
      const res = await getSplBalances(wallet.publicKey.toString());
      const tokenAccountsArray = res.onchainTokens.map(
        ({ pubkey, balance, mint }) => ({
          pubkey,
          balance,
          mint,
        })
      );

      setTokenAccounts(tokenAccountsArray);

      setInitialValues({
        tokenADeposit: 0,
        tokenBReceive: 0,
        mintA: tokenAccountsArray.length > 0 ? tokenAccountsArray[0].mint : '',
        mintB: tokenAccountsArray.length > 1 ? tokenAccountsArray[1].mint : '',
      });

    } catch (error) {
      console.error('Error fetching token accounts:', error);
    }
  };


  const validationSchema = Yup.object({
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
    tokenADeposit: number;
    tokenBReceive: number;
    mintA: string;
    mintB: string;
  }) => {
    try {
      const { tokenADeposit, tokenBReceive, mintA, mintB } = values;
      await makeNewEscrow({
        mint_a: mintA,
        mint_b: mintB,
        deposit: tokenADeposit,
        receive: tokenBReceive,
      });
      toast({
        title: 'Success',
        description: 'Escrow created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating escrow:', error);
      toast({
        title: 'Error',
        description: 'There was an error creating the escrow.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setInitialValues({
        tokenADeposit: 0,
        tokenBReceive: 0,
        mintA: '',
        mintB: '',
      });
      onFinished();
    }
  };

  return (
    <Box>
      <Formik
        enableReinitialize
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
                <FormLabel>Deposit Token (Mint A)</FormLabel>
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
                <FormLabel>Amount to Deposit</FormLabel>
                <Input
                  type="number"
                  name="tokenADeposit"
                  value={values.tokenADeposit}
                  onChange={handleChange}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Receive Token (Mint B)</FormLabel>
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
              <FormControl>
                <FormLabel>Amount to Receive</FormLabel>
                <Input
                  type="number"
                  name="tokenBReceive"
                  value={values.tokenBReceive}
                  onChange={handleChange}
                />
              </FormControl>
            </VStack>
            <HStack justify="space-between" mt={4}>
              <Button
                mt={4}
                colorScheme="gray"
                type="reset"
                onClick={() => resetForm()}
              >
                Reset
              </Button>
              <Button
                colorScheme="teal"
                type="submit"
                isLoading={isSubmitting}
                mt={4}
              >
                Create Escrow
              </Button>
            </HStack>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default MakeEscrow;
