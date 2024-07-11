import {
    Flex,
    Circle,
    Box,
    Image,
    Button,
    HStack,
    Spacer,
    Text,
    VStack,
    Tooltip,
    Center
} from '@chakra-ui/react';
import {useState} from 'react';
import {useConnection, useAnchorWallet} from '@solana/wallet-adapter-react';
import {PublicKey} from '@solana/web3.js';
import {NftItemWithMetadata} from '../hooks/metadataLoader';

export enum GridSizeDisplay {
    LITTLE,
    BIG
}

const NftCard = ({
    nft,
    onInfuse,
    gridSizeDisplay
}: {
    nft: NftItemWithMetadata;
    onInfuse: (nftMint: string) => void;
    gridSizeDisplay?: GridSizeDisplay;
}) => {
    const [isHover, setIsHover] = useState<boolean>(false);
    const wallet = useAnchorWallet();
    const connection = useConnection();

    const infuseHandler = () => {
        onInfuse(nft.nftMint);
    };
    const mouseEnterHandler = () => {
        setIsHover(true);
    };

    const mouseLeaveHandler = () => {
        setIsHover(false);
    };

    return (
        <Box
            role="group"
            bg="gray.800"
            _hover={{
                borderColor: 'aquamarine',
                roundedTop: 'lg',
                transition: '90ms',
                transform: 'translateY(-5px)',
                transitionDuration: '0.3s',
                transitionTimingFunction: 'ease-in-out'
            }}
            borderWidth="1px"
            roundedTop="lg"
            position="relative"
            onMouseEnter={mouseEnterHandler}
            onMouseLeave={mouseLeaveHandler}>
            <Circle
                size="10px"
                position="absolute"
                top={2}
                right={2}
                bg="aquamarine"
            />

            <Image
                boxSize={
                    gridSizeDisplay === GridSizeDisplay.LITTLE
                        ? '200px'
                        : '250px'
                }
                src={nft.imageUri}
                alt="Picture of something"
                roundedTop="lg"
                objectFit="cover"
            />
            <Flex justifyContent="space-between" alignContent="center">
                <Flex
                    justifyContent="space-between"
                    w="100%"
                    px={4}
                    pt={1}
                    pb={1}>
                    <VStack w="100%">
                        <HStack justifyContent="space-between" w="100%">
                            <Text
                                align="center"
                                fontWeight={700}
                                fontSize={'md'}>
                                {nft.title}
                            </Text>
                            {/* <Spacer /> */}
                            {/* <Box borderWidth="1px" rounded="md" p="1">
                                <Tooltip label="Infuse your NFT to get a higher carbon score.">
                                    <Text
                                        fontWeight="thin"
                                        letterSpacing="tighter"
                                        fontSize={{
                                            base: 'sm',
                                            md: 'md'
                                        }}>
                                        {nft.amount} tons
                                    </Text>
                                </Tooltip>
                            </Box> */}
                        </HStack>
                    </VStack>
                </Flex>
            </Flex>
            <HStack
                _groupHover={{
                    visibility: 'visible'
                }}
                visibility="hidden"
                justifyContent="space-evenly"
                spacing="0"
                w="100%">
                <Button
                    rounded="none"
                    roundedBottom="none"
                    m="0"
                    w="100%"
                    colorScheme="aquamarine"
                    onClick={infuseHandler}>
                    Infuse
                </Button>
            </HStack>
        </Box>
    );
};

export default NftCard;
