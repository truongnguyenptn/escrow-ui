import {SimpleGrid} from '@chakra-ui/react';

export enum GridSizeDisplay {
    LITTLE,
    BIG
}

export default function NftGrid({
    children,
    display = GridSizeDisplay.LITTLE
}: {
    children: React.ReactNode;
    display: GridSizeDisplay;
}) {
    return (
        <SimpleGrid
            columns={{
                base: 1,
                md: display === GridSizeDisplay.LITTLE ? 6 : 5
            }}
            columnGap={{base: '4', md: '6'}}
            rowGap={{base: '8', md: '10'}}>
            {children}
        </SimpleGrid>
    );
}
