import {DAS, Helius} from 'helius-sdk';
import {PublicKey} from '@solana/web3.js';
import {useEffect, useState} from 'react';

const helius = new Helius(
    `${process.env.NEXT_PUBLIC_API_KEY_SECRET}`,
    'mainnet-beta'
);

const useInfiniteScroll = (collection: PublicKey, limit: number) => {
    const [items, setItems] = useState<DAS.GetAssetResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const fetch = async () => {
        setIsLoading(true);
        helius.rpc
            .getAssetsByGroup({
                groupKey: 'collection',
                groupValue: collection.toString(),
                page: page,
                limit: limit
            })
            .then((response) => {
                setItems(response.items);
                setPage((prevPage) => prevPage + 1);
            })
            .catch((error) => {
                setError(error);
            })
            .finally(() => setIsLoading(false));
    };

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop !==
                document.documentElement.offsetHeight ||
            isLoading
        ) {
            return;
        }
        fetch();
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading]);

    useEffect(() => {
        fetch();
    }, []);

    return {error, isLoading, items, fetch};
};

export default useInfiniteScroll;
