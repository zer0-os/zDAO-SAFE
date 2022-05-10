import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { zDAO } from '@zero-tech/zdao-sdk';
import { formatBytes32String } from 'ethers/lib/utils';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Blockie from '../components/Blockie';
import Card from '../components/Card';
import { Loader } from '../components/Loader';
import { useSdkContext } from '../hooks/useSdkContext';
import { shortenAddress } from '../utils/address';

const ZDAOBlock = ({ zDAO }: { zDAO: zDAO }) => {
  const textColor = useColorModeValue('gray.700', 'gray.400');

  return (
    <Link
      to={`/${zDAO.title}`}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card height="100%" _hover={{ borderColor: textColor }}>
        <Stack direction="column" alignItems="center" spacing={2} p={4}>
          <Box position="relative" width="82px" height="82px">
            <Blockie
              alt={zDAO.title}
              seed={formatBytes32String(zDAO.title)}
              rounded="full"
              width="full"
              height="full"
              position="absolute"
            />
          </Box>

          <Heading as="h4" textAlign="center" fontSize="md">
            {zDAO.title}
          </Heading>
          <Text textAlign="center">{shortenAddress(zDAO.createdBy)}</Text>
        </Stack>
      </Card>
    </Link>
  );
};

const Home = () => {
  const { instance } = useSdkContext();
  const [loading, setLoading] = useState(true);
  const [zDAOs, setZDAOs] = useState<zDAO[] | undefined>();

  useEffect(() => {
    const fetch = async () => {
      if (!instance) return;
      const list = await instance.listZDAOs();
      setZDAOs(list);
      setLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [instance]);

  return (
    <Container as={Stack} maxW="7xl">
      {loading ? (
        <Stack justifyContent="start">
          <Loader />
        </Stack>
      ) : (
        <VStack spacing={{ base: 6, sm: 12 }} alignItems="center">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={8}>
            {zDAOs && zDAOs.map((dao) => <ZDAOBlock key={dao.id} zDAO={dao} />)}
          </SimpleGrid>
        </VStack>
      )}
    </Container>
  );
};

export default Home;
