import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import { TokenBalanceResponse } from '../types/index';
import useAnchorProvider from '@/hooks/useAnchorProvider';
import { AnchorProvider } from '@coral-xyz/anchor';

export const isToken2022 = async (provider: AnchorProvider, mint: PublicKey) => {
  const mintInfo = await provider.connection.getAccountInfo(mint);
  return mintInfo?.owner.equals(TOKEN_2022_PROGRAM_ID);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function trimText(str = '', len = 4) {
  if (str.length > 10) {
    return (
      str.substring(0, len) + '..' + str.substring(str.length - len, str.length)
    );
  }
  return str;
}

const RPC_PROVIDER_URL = 'https://api.devnet.solana.com';

export async function getSplBalances(
  address: string,
  tokenMintAddresses?: string[]
): Promise<TokenBalanceResponse> {
  const connection = new Connection(RPC_PROVIDER_URL);
  const publicKey = new PublicKey(address);
  const res: TokenBalanceResponse = {
    inAppTokens: [],
    onchainTokens: [],
  };

  try {
    const tokenAccounts = await fetchTokenAccounts(connection, publicKey);
    console.log(tokenAccounts);
    for (const tokenAccount of tokenAccounts.value) {
      const accountData = tokenAccount.account.data.parsed.info;
      const mint = accountData.mint;
      const pubkey = tokenAccount.pubkey;
      const balance = accountData.tokenAmount.amount;

      if (tokenMintAddresses?.includes(mint)) {
        res.inAppTokens.push({
          pubkey,
          balance: parseInt(balance),
          mint,
        });
      } else {
        res.onchainTokens.push({
          pubkey,
          balance: parseInt(balance),
          mint,
        });
      }
    }

    return res;
  } catch (error) {
    console.error('Error fetching Solana balances:', error);
    return {
      inAppTokens: [],
      onchainTokens: [],
    };
  }
}

async function fetchTokenAccounts(
  connection: Connection,
  publicKey: PublicKey,
  maxAttempts = 3
): Promise<any> {
  let tryCount = 0;
  while (tryCount < maxAttempts) {
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
      return tokenAccounts;
    } catch (error) {
      console.error('Error fetching token accounts:', error);
      tryCount++;
      if (tryCount >= maxAttempts) {
        throw new Error('Max retry attempts reached');
      }
    }
  }
  throw new Error('Fetching token accounts failed');
}

export const logSignature = async (signature: string): Promise<string> => {
  console.log(
    `Your transaction signature: https://explorer.solana.com/transaction/${signature}?cluster=custom&customUrl=${RPC_PROVIDER_URL}`
  );
  return signature;
};
