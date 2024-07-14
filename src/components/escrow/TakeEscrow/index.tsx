'use client';
import React, { useState, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useToast,
} from '@chakra-ui/react';
import { BN } from '@coral-xyz/anchor';
import useEscrowProgram from '@/hooks/useEscrowProgram';
import { PublicKey } from '@solana/web3.js';

type Props = {
  receive: BN;
  escrow: PublicKey;
};

const TakeEscrow = ({ receive, escrow }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { takeEscrow } = useEscrowProgram();
  const toast = useToast();

  const handleTake = async () => {
    toast({
      title: 'Taking escrow...',
      status: 'loading',
      duration: 2000,
      isClosable: true,
    });

    try {
      await takeEscrow.mutateAsync({ escrow });
      toast({
        title: 'Escrow taken successfully',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Failed to take escrow',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} width="full">
        Take
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Are you sure?</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to take this escrow? This action is
              irreversible and will send {receive.toString()} of your token B to
              the maker.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="green" onClick={handleTake} ml={3}>
                Take Escrow
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default TakeEscrow;
