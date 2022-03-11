import Blockie from '@/components/Blockie';
import { LinkButton } from '@/components/Button';
import Card from '@/components/Card';
import useExtendedExplore from '@/hooks/useExtendedExplore';
import useInfiniteScroll from '@/hooks/useInfiniteScroll';
import { shorten } from '@/utils/strings';
import {
  Box,
  Container,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import Client from '@snapshot-labs/snapshot.js';
import { formatBytes32String } from 'ethers/lib/utils';
import { useEffect, useRef, useState } from 'react';

const LIST_COUNT = 20;

const getUrl = (url: string) => {
  const rurl = Client.utils.getUrl(url);
  if (!rurl) return '';
  return `https://worker.snapshot.org/mirror?img=${encodeURIComponent(url)}`;
};

const Space = ({ id, space }: { id: string; space: any }) => {
  const textColor = useColorModeValue('gray.700', 'gray.400');
  const imageRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(true);

  return (
    <LinkButton
      href={`/${id}`}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card height={'100%'} _hover={{ borderColor: textColor }}>
        <Stack direction={'column'} alignItems={'center'} spacing={2} p={4}>
          <Box position={'relative'} width={'82px'} height={'82px'}>
            {loaded ? (
              <Image
                ref={imageRef}
                alt={space.name}
                loading={'lazy'}
                rounded={'full'}
                src={getUrl(space.avatarUri)}
                position={'absolute'}
                width={'full'}
                height={'full'}
                onLoad={() => setLoaded(true)}
                onError={() => setLoaded(false)}
              />
            ) : (
              <Blockie
                alt={space.name}
                seed={formatBytes32String(id.slice(0, 10))}
                rounded={'full'}
                width={'full'}
                height={'full'}
                position={'absolute'}
              />
            )}
          </Box>

          <Heading as={'h4'} textAlign={'center'} fontSize={'md'}>
            {shorten(space.name, 16)}
          </Heading>
          <Text textAlign={'center'}>{space.followers} members</Text>
        </Stack>
      </Card>
    </LinkButton>
  );
};

const Home = () => {
  const { exploreLoading, spaces } = useExtendedExplore();
  // const { isFetching, setIsFetching } = useInfiniteScroll(loadMore);
  const [orderedSpaces, setOrderedSpaces] = useState<any>(undefined);

  useEffect(() => {
    setOrderedSpaces(spaces?.slice(0, LIST_COUNT) ?? []);
  }, [spaces]);

  const loadMore = () => {
    if (orderedSpaces.length < spaces.length) {
      setOrderedSpaces((prev) => [
        ...prev,
        ...spaces.slice(prev.length, prev.length + LIST_COUNT),
      ]);
      setIsFectching(false);
      return true;
    }
    return false;
  };
  const { isFetching, setIsFectching } = useInfiniteScroll(loadMore);

  return (
    <Container as={Stack} maxW={'7xl'}>
      {exploreLoading ? (
        <Stack justifyContent={'center'}>
          <Heading as={'h1'} fontSize={'xl'} fontFamily={'body'}>
            Loading ...
          </Heading>
        </Stack>
      ) : (
        <VStack spacing={{ base: 6, sm: 12 }} alignItems={'center'}>
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={8}>
            {orderedSpaces &&
              orderedSpaces.map((space) => (
                <Space key={space.id} id={space.id} space={space} />
              ))}
          </SimpleGrid>
          {isFetching && orderedSpaces.length < spaces.length && (
            <Heading as={'h1'} fontSize={'xl'} fontFamily={'body'}>
              Loading more ...
            </Heading>
          )}
        </VStack>
      )}
    </Container>
  );
};

export default Home;
