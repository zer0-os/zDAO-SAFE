import Card from '@/components/Card';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useExtendedProposal from '@/hooks/useExtendedProposal';
import useExtendedVotes from '@/hooks/useExtendedVotes';
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
import { format } from 'date-fns';
import { useEffect } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LinkExternal from './components/LinkExternal';

const Voting = () => {
  const { account, chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const textColor = useColorModeValue('gray.700', 'gray.400');
  const [searchParams] = useSearchParams();
  const { loadProposal, proposal, proposalLoading } = useExtendedProposal();
  const { loadVotes, votes, votesLoading } = useExtendedVotes();

  useEffect(() => {
    const proposalId = searchParams.get('id');
    if (proposalId) {
      loadProposal(proposalId);
      loadVotes(proposalId);
    }
  }, [searchParams]);

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link onClick={() => navigate(-1)}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </Link>

        {proposal && votes ? (
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
                {proposal.title}
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
                {proposal.body}
              </Text>

              {/* cast my vote */}
              <Card title={'Cast your vote'}>
                <Stack spacing={2} direction={'column'}>
                  {proposal.choices.map((choice) => (
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
              <Card title={`Votes(${votes.length})`}>
                <Stack spacing={4} direction={'column'}>
                  {votes &&
                    votes.map((index, vote) => (
                      <SimpleGrid columns={3} key={index} spacing={10}>
                        <LinkExternal
                          type={'vote'}
                          value={shortenAddress(vote.voter)}
                        />
                        <Text textAlign={'center'}>
                          {proposal.choices[vote.choice]}
                        </Text>
                        <Text textAlign={'right'}>{vote.vp}</Text>
                      </SimpleGrid>
                    ))}
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
                    <LinkExternal type={'proposal'} value={proposal.id} />

                    {/* creator */}
                    {account && (
                      <>
                        <Text>Creator</Text>
                        <LinkExternal
                          type={'account'}
                          value={shortenAddress(proposal.author)}
                        />
                      </>
                    )}

                    {/* snapshot */}
                    <Text>Snapshot</Text>
                    <LinkExternal type={'snapshot'} value={proposal.snapshot} />

                    {/* status */}
                    <Badge
                      textAlign={'center'}
                      rounded="full"
                      p="1"
                      fontSize="0.8em"
                      colorScheme="red"
                    >
                      {proposal.state}
                    </Badge>
                    <Spacer />

                    {/* start date */}
                    <Text>Start Date</Text>
                    <Text>{format(proposal.created, 'yyyy-mm-dd HH:mm')}</Text>

                    {/* end date */}
                    <Text>End Date</Text>
                    <Text>{format(proposal.end, 'yyyy-mm-dd HH:mm')}</Text>
                  </SimpleGrid>
                </Stack>
              </Card>

              {/* current results */}
              <Card title={'Current Results'}>
                <Stack spacing={2} direction={'column'}>
                  {proposal.scores.map((index, score) => (
                    <>
                      <Text>Yes</Text>
                      <Progress
                        min={0}
                        max={100}
                        value={
                          proposal.scores_total > 0
                            ? (score * 100) / proposal.scores_total
                            : 0
                        }
                      ></Progress>
                      <Text>{score} votes</Text>
                      <Spacer />
                    </>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Stack>
        ) : (
          <Stack justifyContent={'center'}>
            <Heading as={'h1'} fontSize={'xl'} fontFamily={'body'}>
              Loading ...
            </Heading>
          </Stack>
        )}
      </VStack>
    </Container>
  );
};

export default Voting;
