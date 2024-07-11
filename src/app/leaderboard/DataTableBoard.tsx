import {Table, Tbody, Td, Th, Thead, Tr, Image} from '@chakra-ui/react';
import {LeaderBoardItem} from './InfusedAccount';

const DataTableBoard = ({accounts}: {accounts: LeaderBoardItem[]}) => {
    return (
        <Table>
            <Thead>
                <Tr>
                    <Th>Rank</Th>
                    <Th>Image</Th>
                    <Th>Name</Th>
                    <Th>Collection</Th>
                    <Th>Owner</Th>
                    <Th>CarbonScore</Th>
                </Tr>
            </Thead>
            <Tbody>
                {accounts &&
                    accounts.map((account, index) => (
                        <Tr
                            key={account.nftMint.toString()}
                            _hover={{
                                background: '#6AFFAE',
                                color: 'gray.800',
                                opacity: 0.95,
                                transform: 'translateY(-5px)',
                                transitionDuration: '0.3s',
                                transitionTimingFunction: 'ease-in-out'
                            }}>
                            <Td>{index + 1}</Td>
                            <Td>
                                <Image
                                    boxSize="65px"
                                    src={account.imageUri}
                                    alt="Picture of something"
                                    roundedTop="lg"
                                    objectFit="cover"
                                />
                            </Td>
                            <Td>
                                {account.nftMint.toString().substring(0, 6)}...
                            </Td>
                            <Td>{account.collection}</Td>
                            <Td>
                                {account.owner?.toString().substring(0, 6)}...
                            </Td>
                            <Td>{account.carbonScore.toString()}</Td>
                        </Tr>
                    ))}
            </Tbody>
        </Table>
    );
};

export default DataTableBoard;
