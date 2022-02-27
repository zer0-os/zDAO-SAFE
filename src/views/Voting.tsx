import Card from '@/components/Card';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { shortenAddress } from '@/utils/address';
import {
  Badge,
  Button,
  Container,
  Heading,
  Link,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import LinkExternal from './components/LinkExternal';

// @todo, fetch through api
const Choices = ['Yes', 'No'];

const Voting = () => {
  const { account, chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.700', 'gray.400');

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link onClick={() => navigate(-1)}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </Link>

        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', sm: 'row' }}
          w={'full'}
        >
          <Stack direction={'column'} spacing={6} flex={1}>
            {/* title, body */}
            <Text
              borderColor={'gray.300'}
              borderWidth={'1px'}
              color={textColor}
              minHeight={12}
              p={4}
              rounded={'md'}
              textAlign={'left'}
            >
              Title
            </Text>
            <Text
              borderColor={'gray.300'}
              borderWidth={'1px'}
              color={textColor}
              minHeight={24}
              p={4}
              rounded={'md'}
              textAlign={'left'}
            >
              Body
            </Text>

            {/* cast my vote */}
            <Card title={'Cast your vote'}>
              <Stack spacing={2} direction={'column'}>
                {Choices.map((choice) => (
                  <Button
                    key={choice}
                    bg={'transparent'}
                    borderWidth={'1px'}
                    rounded={'full'}
                    _focus={{
                      borderColor: 'gray.600',
                    }}
                    _hover={{
                      bg: 'gray.100',
                    }}
                  >
                    {choice}
                  </Button>
                ))}
                <Button
                  bg={'blue.100'}
                  borderWidth={'1px'}
                  rounded={'full'}
                  _focus={{
                    borderColor: 'blue.600',
                  }}
                  _hover={{
                    bg: 'blue.100',
                  }}
                >
                  Vote
                </Button>
              </Stack>
            </Card>

            {/* all the votes */}
            <Card title={'Votes(36)'}>
              <Stack spacing={4} direction={'column'}>
                <SimpleGrid columns={3} spacing={10}>
                  <LinkExternal type={'vote'} value={'QmwddaN1'} />
                  <Text textAlign={'center'}>Yes</Text>
                  <Text textAlign={'right'}>10,386</Text>
                </SimpleGrid>

                <SimpleGrid columns={3} spacing={10}>
                  <LinkExternal type={'vote'} value={'QmwddaN1'} />
                  <Text textAlign={'center'}>Yes</Text>
                  <Text textAlign={'right'}>10,386</Text>
                </SimpleGrid>
              </Stack>
            </Card>
          </Stack>

          <Stack direction={'column'} width={{ base: 'full', sm: '400px' }}>
            {/* details */}
            <Card title={'Details'}>
              <Stack spacing={2} direction={'column'}>
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 2fr' }}
                >
                  {/* identifier */}
                  <Text>Identifier</Text>
                  <LinkExternal type={'proposal'} value={'QmmwenddaN1'} />

                  {/* creator */}
                  {account && (
                    <>
                      <Text>Creator</Text>
                      <LinkExternal
                        type={'account'}
                        value={shortenAddress(account)}
                      />
                    </>
                  )}

                  {/* snapshot */}
                  <Text>Snapshot</Text>
                  <LinkExternal type={'snapshot'} value={'15324632'} />

                  {/* status */}
                  <Badge
                    textAlign={'center'}
                    rounded="full"
                    p="1"
                    fontSize="0.8em"
                    colorScheme="red"
                  >
                    Active
                  </Badge>
                  <Spacer />

                  {/* start date */}
                  <Text>Start Date</Text>
                  <Text>2022-02-28 01:00</Text>

                  {/* end date */}
                  <Text>End Date</Text>
                  <Text>2022-02-28 23:00</Text>
                </SimpleGrid>
              </Stack>
            </Card>

            {/* current results */}
            <Card title={'Current Results'}>
              <Stack spacing={2} direction={'column'}>
                <Text>Yes</Text>
                <Progress min={0} max={100} value={80}></Progress>
                <Text>311 votes</Text>
                <Spacer />
                <Text>No</Text>
                <Progress min={0} max={100} value={20}></Progress>
                <Text>5 votes</Text>
              </Stack>
            </Card>
          </Stack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default Voting;
