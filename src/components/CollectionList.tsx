import {
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Image,
  Link,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/react';

export interface CollectionProps {
  address: string;
  imageUri: string;
  name: string;
  supply: number;
  totalScore: number;
  sevenDayInfused: number;
  sevenDayVar: number;
}

const CollectionList = ({
  collections,
}: {
  collections: CollectionProps[];
}) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Rank</Th>
          <Th>Image</Th>
          <Th>Collection</Th>
          <Th>Supply</Th>
          <Th>TotalScore</Th>
          <Th>7D infused</Th>
          <Th>7D variation</Th>
        </Tr>
      </Thead>
      <Tbody>
        {collections &&
          collections.map((collection, index) => (
            <LinkBox
              as={Tr}
              key={collection.address}
              _hover={{
                background: '#6AFFAE',
                color: 'gray.800',
                opacity: 0.95,
                transform: 'translateY(-5px)',
                transitionDuration: '0.3s',
                transitionTimingFunction: 'ease-in-out',
              }}
            >
              <Td>
                <LinkOverlay href={`/collection/${collection.address}`}>
                  {index + 1}
                </LinkOverlay>
              </Td>
              <Td>
                <Image
                  boxSize="45px"
                  src={collection.imageUri}
                  alt="Picture of something"
                  rounded="lg"
                  objectFit="cover"
                />
              </Td>
              <Td>{collection.name}</Td>
              <Td>{collection.supply}</Td>
              <Td>{collection.totalScore}(t)</Td>
              <Td>{collection.sevenDayInfused}(t)</Td>
              <Td>{collection.sevenDayVar}%</Td>
            </LinkBox>
          ))}
      </Tbody>
    </Table>
  );
};

export default CollectionList;
