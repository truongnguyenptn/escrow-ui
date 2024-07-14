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

const CreateEscrowButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <Button onClick={onOpen} colorScheme="teal">
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
              <Link
                href="https://faucet.circle.com/"
                color="teal.500"
              >
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
