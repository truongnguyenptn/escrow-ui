import {
    Text,
    Box,
    HStack,
    Button,
    Spacer,
    Input,
    Select,
    Link
} from '@chakra-ui/react';
import {ChangeEvent, useState} from 'react';
import {BsFillGridFill, BsFillGrid3X3GapFill} from 'react-icons/bs';

export enum GridSizeDisplay {
    LITTLE,
    BIG
}

interface CardInfosProps {
    onGridChange: (newSizeDisplay: GridSizeDisplay) => void;
    onSearchCollection: (collection: string) => void;
    onSearchOwner: (wallet: string) => void;
    collection: string;
}

const ToolsBar = ({
    onGridChange,
    onSearchCollection,
    onSearchOwner,
    collection
}: CardInfosProps) => {
    const [searchOwner, setSearchOwner] = useState<string>();
    const [selectedCollection, setSelectedCollection] = useState<string>();
    const litleGridClickHandler = () => {
        onGridChange(GridSizeDisplay.LITTLE);
    };

    const bigGridClickHandler = () => {
        onGridChange(GridSizeDisplay.BIG);
    };

    const collectionChangeHandle = (event: ChangeEvent<HTMLSelectElement>) => {
        onSearchCollection(event.target.value);
    };

    return (
        <Box position="relative" w="100%" p="8px">
            <HStack justifyContent="space-between">
                {/* <Text>Owner Address:</Text>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (!searchOwner) return;
                        onSearchOwner(searchOwner);
                    }}>
                    <Input
                        value={searchOwner}
                        onChange={(e) => setSearchOwner(e.currentTarget.value)}
                    />
                </form> */}
                <HStack>
                    <Link href="/">Collections</Link>
                    <Text>{'>'}</Text>
                    <Text>{collection}</Text>
                </HStack>
                <Spacer />
                <Button onClick={litleGridClickHandler}>
                    <BsFillGrid3X3GapFill />
                </Button>
                <Button onClick={bigGridClickHandler}>
                    <BsFillGridFill />
                </Button>
            </HStack>
        </Box>
    );
};

export default ToolsBar;
