import {DAS, Helius} from 'helius-sdk';
import {InfusedAccount, LeaderBoardItem} from './InfusedAccount';
import {formatWithOptions} from 'util';

const helius = new Helius(
    `${process.env.NEXT_PUBLIC_API_KEY_SECRET}`,
    'mainnet-beta'
);

export const getAsset = async (account: InfusedAccount) => {
    return await helius.rpc.getAsset(account.nftMint.toString());
};

export const filter = async (data: DAS.GetAssetResponse) => {
    if (!data) return false;
    if (!data.content) return false;

    const response = await fetch(data.content?.json_uri);
    const metadata = await response.json();

    if (!metadata) return false;
    if (!metadata.collection) return false;
    return true;
};

export interface BaseInfusedAccount {
    nftMint: string;
    imageUri: string;
    name: string;
    collection: string;
    owner: string;
    carbonScore: number;
}

export const loadedInfusedAccount = async (account: BaseInfusedAccount) => {
    const defaultAccount = {
        nftMint: account.nftMint.toString(),
        imageUri: 'images.png',
        name: 'N/A',
        collection: 'N/A',
        owner: 'N/A',
        carbonScore: account.carbonScore
    };
    const data = await helius.rpc.getAsset(account.nftMint.toString());
    if (!data) return defaultAccount;
    if (!data.content) return defaultAccount;

    const response = await fetch(data.content?.json_uri);
    const metadata = await response.json();

    if (!metadata) return defaultAccount;

    if (!metadata.collection)
        return {
            nftMint: account.nftMint,
            imageUri: metadata.image ? metadata.image : 'images.png',
            name: metadata.name,
            collection: 'N/A',
            owner: data.ownership.owner ? data.ownership.owner : 'test',
            carbonScore: account.carbonScore.toString()
        } as unknown as LeaderBoardItem;

    return {
        nftMint: account.nftMint,
        imageUri: metadata.image ? metadata.image : 'images.png',
        name: metadata.name,
        collection: metadata.collection.name.toString(),
        owner: data.ownership.owner ? data.ownership.owner : 'test',
        carbonScore: account.carbonScore.toString()
    } as unknown as LeaderBoardItem;
};

// const filterAccounts = async (mappedAccounts: InfusedAccount[]) => {
//     const filterMissLoaded = async (accs: InfusedAccount[]) =>
//         accs?.reduce(async (accumulatorPromise, account) => {
//             const accumulator = await accumulatorPromise;
//             const loaded = await getAsset(account);
//             if (await filter(loaded)) {
//                 return [...accumulator, account];
//             }

//             return accumulator;
//         }, Promise.resolve([] as InfusedAccount[])) || ([] as InfusedAccount[]);

//     const results = await filterMissLoaded(mappedAccounts);
//     const items = await Promise.all(
//         results.map(async (result) => await loadedInfusedAccount(result))
//     );
//     console.log('Results: ', items);
//     // setAccouts(items);
// };
