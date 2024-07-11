import {PublicKey} from '@solana/web3.js';
import NftGrid, {GridSizeDisplay} from './NftGrid';
import NftCard from './NftCard';
import {NftItemWithMetadata, loadMetadata} from '../hooks/metadataLoader';
import {useEffect, useMemo, useState} from 'react';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import {DAS, Helius} from 'helius-sdk';

const helius = new Helius(
    `${process.env.NEXT_PUBLIC_API_KEY_SECRET}`,
    'mainnet-beta'
);

const CollectionDisplay = ({
    collection,
    display,
    onInfuse
}: {
    collection: PublicKey;
    display: GridSizeDisplay;
    onInfuse: (nftMint: string) => void;
}) => {
    const {error, isLoading, items} = useInfiniteScroll(
        collection,
        display === GridSizeDisplay.BIG ? 20 : 24
    );
    const [nfts, setNfts] = useState<NftItemWithMetadata[]>([]);

    const infuseHandler = (nftMint: string) => {
        onInfuse(nftMint);
    };

    useEffect(() => {
        const load = async () => {
            const loadedData = await loadMetadata(items);
            setNfts((prevItems) => [...prevItems, ...loadedData]);
        };

        load();
    }, [items]);

    return (
        <>
            <NftGrid display={display}>
                {nfts &&
                    nfts.map((d) => (
                        <NftCard
                            key={d.title}
                            nft={d}
                            gridSizeDisplay={display}
                            onInfuse={infuseHandler}></NftCard>
                    ))}
            </NftGrid>
        </>
    );
};

export default CollectionDisplay;
