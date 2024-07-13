import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

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

export interface Position {
  pubkey: string;
  balance: number;
  mint: string;
}

export interface PositionResponse {
  inAppPositions: Position[];
  onchainPositions: Position[];
}

const RPC_PROVIDER_URL = 'https://api.devnet.solana.com';

export async function splBalances(
  address: string,
  tokenMintAddresses?: string[]
): Promise<PositionResponse> {
  const connection = new Connection(RPC_PROVIDER_URL);
  const publicKey = new PublicKey(address);
  const res: PositionResponse = {
    inAppPositions: [],
    onchainPositions: [],
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
        res.inAppPositions.push({
          pubkey,
          balance: parseInt(balance),
          mint,
        });
      } else {
        res.onchainPositions.push({
          pubkey,
          balance: parseInt(balance),
          mint,
        });

        res.onchainPositions.push({
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
      inAppPositions: [],
      onchainPositions: [],
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
