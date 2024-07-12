'use client';

import { Box, VStack, Text, useDisclosure } from '@chakra-ui/react';
import { useAnchorWallet, useWallet } from '@solana/wallet-adapter-react';
import { useState } from 'react';
import { GridSizeDisplay } from '../../../components/NftGrid';
import { PublicKey } from '@solana/web3.js';
import CollectionDisplay from '../../../components/CollectionDisplay';
import ToolsBar from '../../../components/ToolsBar';
import InfuseModal from '../../../components/infuseModal';
import InfusedAlert from '../../../components/InfusedAlert';

export default function Collection({
  params,
}: {
  params: { address: string };
}) {
  const address = params.address;
  const wallet = useWallet();
  const anchorWallet = useAnchorWallet();
  const [searchWallet, setSearchWallet] = useState<string>();
  const [searchingMode, setSearchingMode] = useState<number>(1);
  const [nftToInfuse, setNftToInfuse] = useState<string>();
  const [state, setState] = useState<PublicKey>();
  const {
    isOpen: isInfusedModalOpen,
    onOpen: onInfusedModalOpen,
    onClose: onInfusedModalClose,
  } = useDisclosure();
  const [collection, setCollection] = useState<string>(address);
  const [gridSizeDisplay, setGridSizeDisplay] = useState<GridSizeDisplay>(
    GridSizeDisplay.LITTLE
  );

  const {
    isOpen: isAlertVisible,
    onClose: onAlertClose,
    onOpen: onAlertOpen,
  } = useDisclosure({ defaultIsOpen: false });

  // useEffect(() => {
  //   if (!program) return;
  //   const [statePda] = PublicKey.findProgramAddressSync(
  //     [utils.bytes.utf8.encode('global-registry')],
  //     program.programId
  //   );
  //   setState(statePda);
  // }, [program]);

  // useEffect(() => {
  //   const syncWallet = async () => {
  //     if (wallet.publicKey && !searchWallet)
  //       setSearchWallet(wallet.publicKey.toString());
  //   };
  //   syncWallet();
  // }, [wallet, connection, searchingMode, searchWallet]);

  // useEffect(() => {
  //   if (!program) return;
  //   const [statePda] = PublicKey.findProgramAddressSync(
  //     [utils.bytes.utf8.encode('global-registry')],
  //     program.programId
  //   );
  //   setState(statePda);
  // }, [program]);

  const searchCollectionHandler = (collection: string) => {
    setCollection(collection);
    setSearchingMode(1);
  };

  const searchOwnerHandler = (owner: string) => {
    setSearchWallet(owner);
    setSearchingMode(0);
  };

  const gridChangedHandler = (newSizeDisplay: GridSizeDisplay) => {
    if (newSizeDisplay !== gridSizeDisplay) {
      setGridSizeDisplay(newSizeDisplay);
    }
  };

  const infuseHandler = (nftMint: string) => {
    setNftToInfuse(nftMint);
    onInfusedModalOpen();
  };

  const infuseNft = async (amount: number) => {
    // if (!state) return;
    // if (!program) return;
    // if (!provider) return;
    // if (!connection) return;
    // if (!anchorWallet) return;
    // if (!nftToInfuse) return;
    // await infuse(program, new BN(amount), new PublicKey(nftToInfuse));
  };

  return (
    <Box
      maxW="7xl"
      mx="auto"
      marginTop={50}
      minHeight="100vh"
      px={{ base: '4', md: '8', lg: '10' }}
      py={{ base: '6', md: '8', lg: '10' }}
    >
      <VStack>
        <Text>
        The Escrow component is designed to facilitate secure and transparent transactions between parties on the Solana blockchain. It allows users to deposit tokens into a secure vault, ensuring that both the buyer and seller fulfill their obligations before the assets are released
        </Text>
        <ToolsBar
          onGridChange={gridChangedHandler}
          onSearchCollection={searchCollectionHandler}
          onSearchOwner={searchOwnerHandler}
          collection={collection}
        />
        <InfuseModal
          isOpen={isInfusedModalOpen}
          onClose={onInfusedModalClose}
          onInfuse={infuseNft}
        />
        {isAlertVisible && <InfusedAlert onClose={onAlertClose} />}

        {/* {searchWallet && searchingMode === 0 && (
                    <OwnerDisplay
                        wallet={new PublicKey(searchWallet)}
                        display={gridSizeDisplay}
                        onInfuse={infuseHandler}
                    />
                )} */}
        {/* if collection pubkey is valid && collection exist */}
        {collection && (
          <CollectionDisplay
            collection={new PublicKey(collection)}
            display={gridSizeDisplay}
            onInfuse={infuseHandler}
          />
        )}
      </VStack>
    </Box>
  );
}
