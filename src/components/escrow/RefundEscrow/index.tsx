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
import { PublicKey } from '@solana/web3.js';
import useEscrowProgram from '@/hooks/useEscrowProgram';

type Props = {
  escrow: PublicKey;
};

const RefundEscrowButton = ({ escrow }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const { refundEscrow } = useEscrowProgram();
  const toast = useToast();

  const handleRefund = async () => {
    toast({
      title: 'Processing refund...',
      status: 'loading',
      duration: 2000,
      isClosable: true,
    });

    try {
      await refundEscrow({ escrow });
      toast({
        title: 'Escrow successfully refunded',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error refunding escrow',
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
      <Button onClick={() => setIsOpen(true)} size="sm" variant="ghost">
        Refund Escrow
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Confirm Refund</AlertDialogHeader>
            <AlertDialogCloseButton />
            <AlertDialogBody>
              Are you sure you want to refund this escrow? This action cannot be
              undone and the escrow will be deleted.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleRefund} ml={3}>
                Confirm Refund
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default RefundEscrowButton;
