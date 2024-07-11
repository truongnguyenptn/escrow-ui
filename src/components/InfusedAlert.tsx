'use client';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  CloseButton,
  Icon,
  Text,
} from '@chakra-ui/react';
import { FaHeart } from 'react-icons/fa';

const InfusedAlert = ({ onClose }: { onClose: () => void }) => {
  return (
    <Alert status='success'>
      <AlertIcon />
      <Box width='100%'>
        <AlertTitle>
          infused with love <Icon as={FaHeart} />
        </AlertTitle>
        <AlertDescription>
          <Text>but nothing happened!</Text>
        </AlertDescription>
      </Box>
      <CloseButton
        position='relative'
        right={-1}
        top={-1}
        onClick={onClose}
      />
    </Alert>
  );
};

export default InfusedAlert;
