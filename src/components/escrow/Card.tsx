import React, { useMemo } from 'react';
import { BN, ProgramAccount } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import {
  Box,
  Flex,
  Heading,
  Text,
  Avatar,
  Divider,
  Icon,
} from '@chakra-ui/react';
import {
  CircleUser,
  Coins,
  CornerUpRight,
  CornerDownRight,
  Handshake,
} from 'lucide-react';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
// import useTokenBalance from '@/hooks/useTokenBalance';
import TokenAmount from '../TokenAmount';
import TakeEscrow from './button/TakeEscrow';
import ExplorerLink from '../ExplorerLink';
import { trimText } from '@/lib';

type Props = {
  data: ProgramAccount<{
    seed: BN;
    maker: PublicKey;
    mintA: PublicKey;
    mintB: PublicKey;
    receive: BN;
    bump: number;
  }>;
};

const tokenProgram = TOKEN_PROGRAM_ID;

const EscrowCard: React.FC<Props> = ({ data }) => {
  const vaultAccount = useMemo(() => {
    return getAssociatedTokenAddressSync(
      data.account.mintA,
      data.publicKey,
      true,
      tokenProgram
    );
  }, [data.account.mintA, data.publicKey]);

  // const { data: tokenBalance } = useTokenBalance(vaultAccount);
  // console.log(tokenBalance);

  return (
    <Box
      p={5}
      shadow="md"
      borderWidth="1px"
      borderRadius="md"
      cursor="pointer"
      _hover={{ borderColor: 'teal.500' }}
    >
      <Flex direction="column" gap={4}>
        <Flex align="center" mb={4}>
          <Icon as={Handshake} mr={2} />
          <Heading size="md">Escrow Details</Heading>
        </Flex>
        <Text>
          Escrow ID:{' '}
          <Text as="span" color="teal.500" ml={2}>
            {trimText(data.account.seed.toString())}
          </Text>
        </Text>

        <Divider my={4} />

        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <Icon as={CircleUser} mr={2} />
            <Text>Maker:</Text>
          </Flex>
          <ExplorerLink type="address" value={data.account.maker.toString()}>
            <Avatar size="sm">
              {trimText(data.account.maker.toString(), 1)}
            </Avatar>
          </ExplorerLink>
        </Flex>

        <Heading size="sm" mb={2}>
          Exchange Information
        </Heading>

        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <Icon as={CornerDownRight} mr={2} />
            <Text>From Token (A):</Text>
          </Flex>
          <ExplorerLink type="address" value={data.account.mintA.toString()}>
            <Text color="teal.500" fontSize="sm">
              {trimText(data.account.mintA.toString(), 8)}
            </Text>
          </ExplorerLink>
        </Flex>

        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <Icon as={CornerUpRight} mr={2} />
            <Text>To Token (B):</Text>
          </Flex>
          <ExplorerLink type="address" value={data.account.mintB.toString()}>
            <Text color="teal.500" fontSize="sm">
              {trimText(data.account.mintB.toString(), 8)}
            </Text>
          </ExplorerLink>
        </Flex>

        <Flex justify="space-between" align="center" mb={4}>
          <Flex align="center">
            <Icon as={Coins} mr={2} />
            <Text>Maker will receive:</Text>
          </Flex>
          <Flex align="center" color="teal.500" fontSize="sm">
            <TokenAmount
              amount={data.account.receive.toString()}
              decimals={9}
            />
            <Text fontWeight="bold" ml={2} color="yellow.500">
              B token
            </Text>
          </Flex>
        </Flex>

        <Divider my={4} />

        <TakeEscrow receive={data.account.receive} escrow={data.publicKey} />
      </Flex>
    </Box>
  );
};

export default EscrowCard;
