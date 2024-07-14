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
} from '@chakra-ui/react';
import MakeEscrow from './MakeEscrow'; // Ensure this import path is correct

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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CreateEscrowButton;
