'use client';

import React from 'react';
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import MakeEscrow from './MakeEscrow'; // Ensure this import path is correct
import { Link } from '@chakra-ui/next-js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMarketProgram } from '@/hooks/useMarket';
const CreateEscrowButton = () => {
  const { createMarket } = useMarketProgram();
  const { publicKey, signTransaction, sendTransaction } = useWallet();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleCreateMarket = async () => {
    if (!publicKey) {
      alert('Please connect your wallet!');
      return;
    }
    try {
      // Create the market using the hook's createMarket mutation
      const transactionSignature = await createMarket.mutateAsync({
        eventName: 'Will SOL reach ATH this year?',
        outcomeOptions: ['Yes', 'No'],
      });

      console.log('Transaction signature:', transactionSignature);

      // Notify the user of success
      // notifications.pushNotification('Market created successfully!', {
      //   autoRemove: true,
      //   type: 'Success',
      //   lifetime: 15,
      // });
    } catch (error) {
      console.error('Error creating market:', error);
      // notifications.pushNotification('Failed to create market.', {
      //   autoRemove: true,
      //   type: 'Error',
      //   lifetime: 15,
      // });
    }
  };
  return (
    <Box>
      <Button onClick={handleCreateMarket} colorScheme="teal">
        Create New Escrow
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={6}>
          <ModalHeader>Create a New Escrow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <MakeEscrow onFinished={onClose} />
            <Text mt={4} fontSize="sm" color="gray.500">
              Do not have testnet tokens?{' '}
              <Link href="https://faucet.circle.com/" color="teal.500">
                Go to this faucet
              </Link>
              .
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateEscrowButton;
