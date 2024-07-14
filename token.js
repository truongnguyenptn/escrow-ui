const { Connection, PublicKey } = require('@solana/web3.js');
const { getAccount } = require('@solana/spl-token');

// Connection to the Solana devnet
const connection = new Connection('https://api.devnet.solana.com');
const PDA_PUBLIC_KEY = 'HQpev3AabCnUKUsQUUruPsyEY8jk1aGvEjUwq58KMyAD';

// Replace with your PDA public key and token mint address
const pdaPublicKey = new PublicKey(PDA_PUBLIC_KEY);
const tokenMintAddress = new PublicKey("HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr");

async function getTokenBalance(pda, tokenMint) {
  try {
    // Fetch the token account associated with the PDA and the specific token mint
    const tokenAccount = await connection.getParsedTokenAccountsByOwner(pda, { mint: tokenMint });

    if (tokenAccount.value.length > 0) {
      // Assuming the PDA has only one token account for the specific token mint
      const tokenBalance = tokenAccount.value[0].account.data.parsed.info.tokenAmount.amount;
      console.log(`Token Balance: ${tokenBalance}`);
    } else {
      console.log('No token account found for this PDA and token mint.');
    }
  } catch (error) {
    console.error('Error fetching token balance:', error);
  }
}

getTokenBalance(pdaPublicKey, tokenMintAddress);
// Replace this with the PDA public key you want to check
