import {DAS, Helius} from 'helius-sdk';
import {PublicKey} from '@solana/web3.js';
import {useEffect, useState} from 'react';

const helius = new Helius(
    `${process.env.NEXT_PUBLIC_API_KEY_SECRET}`,
    'mainnet-beta'
);

const useFetchCollectionItems = (collection: PublicKey, limit: number) => {
    const [data, setData] = useState<DAS.GetAssetResponse[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);

    const reload = async () => {
        helius.rpc
            .getAssetsByGroup({
                groupKey: 'collection',
                groupValue: collection.toString(),
                page: page,
                limit: limit
            })
            .then((response) => {
                setIsLoaded(true);
                setData((prevItems) => [...prevItems, ...response.items]);
                setPage((prevPage) => prevPage + 1);
            })
            .catch((error) => {
                setError(error);
            });
    };

    useEffect(() => {
        const fetchData = () => {
            helius.rpc
                .getAssetsByGroup({
                    groupKey: 'collection',
                    groupValue: collection.toString(),
                    page: page,
                    limit: limit
                })
                .then((response) => {
                    setIsLoaded(true);
                    setData((prevItems) => [...prevItems, ...response.items]);
                    setPage((prevPage) => prevPage + 1);
                })
                .catch((error) => {
                    setError(error);
                });
        };

        fetchData();
    }, [collection]);

    return {error, isLoaded, data, reload};
};

export default useFetchCollectionItems;
