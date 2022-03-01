import Card from '@/components/Card';
import TransferAbi from '@/config/abi/transfer.json';
import { SAFE_ADDRESS, SAFE_SERVICE_URL } from '@/config/constants/gnosis-safe';
import { IPFS_GATEWAY, SPACE_ID } from '@/config/constants/snapshot';
import { getPower } from '@/helpers/snapshot';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useClient from '@/hooks/useClient';
import useExtendedProposal from '@/hooks/useExtendedProposal';
import useExtendedResults from '@/hooks/useExtendedResults';
import useExtendedSpace from '@/hooks/useExtendedSpace';
import useExtendedVotes from '@/hooks/useExtendedVotes';
import { shortenAddress } from '@/utils/address';
import { shortenProposalId } from '@/utils/proposal';
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
  useToast,
  VStack,
} from '@chakra-ui/react';
import Safe from '@gnosis.pm/safe-core-sdk';
import EthersAdapter from '@gnosis.pm/safe-ethers-lib';
import { SafeEthersSigner, SafeService } from '@gnosis.pm/safe-ethers-adapters';
import Client from '@snapshot-labs/snapshot.js';
import { format } from 'date-fns';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import LinkExternal from './components/LinkExternal';
import BigNumber from 'bignumber.js';

const MAX_VISIBLE_COUNT = 10;

const getFormatedValue = (value) =>
  parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
const getPercentage = (n, max) => (max ? (100 / max) * n : 0);

const Voting = () => {
  const { account, library } = useActiveWeb3React();
  const { sendEIP712 } = useClient();
  const textColor = useColorModeValue('gray.700', 'gray.400');
  const { id: proposalId } = useParams();
  const { space } = useExtendedSpace(SPACE_ID);
  const { proposal, proposalLoading } = useExtendedProposal(proposalId);
  const { votes, votesLoading } = useExtendedVotes(proposalId);
  const {
    results,
    votes: votesEx,
    resultsLoading,
  } = useExtendedResults(space, proposal, votes);
  const [myChoice, setMyChoice] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const toast = useToast();

  const sortedVotes = useMemo(() => {
    if (!votesEx) {
      return undefined;
    }
    return votesEx.slice(0, MAX_VISIBLE_COUNT);
  }, [votesEx]);

  const handleVote = async () => {
    try {
      const response = await getPower(SPACE_ID, account, proposal);
      const vp = response.totalScore;
      if (vp > 0 && myChoice >= 0) {
        const result = await sendEIP712(space, 'vote', {
          proposal,
          choice: myChoice + 1,
          metadata: {},
        });
        console.log('voting result', result);
        if (result.id) {
          toast({
            title: 'You can cast your vote',
            position: 'top-right',
            isClosable: true,
          });
          window.location.reload();
        }
      } else {
        toast({
          title: 'You can not cast your vote',
          position: 'top-right',
          status: 'error',
          isClosable: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteProposal = async () => {
    console.log('handleExecuteProposal');
    if (!library) return;
    setIsExecuting(true);
    try {
      console.log('Fetching IPFS file', proposal.ipfs);
      const ipfs = await Client.utils.ipfsGet(IPFS_GATEWAY, proposal.ipfs);
      console.log('ipfs', ipfs);
      const metadata = JSON.parse(ipfs.data.message.metadata);

      const contract = metadata.contract;
      const abi = metadata.abi;
      const sender = metadata.sender;
      const recipient = metadata.recipient;
      const token = metadata.token;
      const amount = metadata.amount;

      console.log('Safe Service Url', SAFE_SERVICE_URL);
      console.log('Safe Address', SAFE_ADDRESS);
      const service = new SafeService(SAFE_SERVICE_URL);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: library?.getSigner(),
      });
      const safe = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRESS });
      const safeSigner = new SafeEthersSigner(safe, service, library);
      const transferContract = new ethers.Contract(contract, abi, safeSigner);
      const proposedTx = await transferContract.transferToken(
        sender,
        recipient,
        token,
        amount
      );
      console.log('USER ACTION REQUIRED');
      console.log('Go to the Gnosis Safe Web App to confirm the transaction');
      console.log(await proposedTx.wait());
      console.log('Transaction has been executed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link href={'/'}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </Link>

        {proposal && sortedVotes ? (
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
                  {proposal.choices.map((choice, index) => (
                    <Button
                      key={choice}
                      bg={'transparent'}
                      borderColor={index === myChoice ? 'gray.600' : 'default'}
                      borderWidth={'1px'}
                      rounded={'full'}
                      _focus={{
                        borderColor: 'gray.600',
                      }}
                      _hover={{
                        bg: 'gray.100',
                      }}
                      onClick={() => setMyChoice(index)}
                    >
                      {choice}
                    </Button>
                  ))}
                  <Button
                    bg={'blue.100'}
                    borderWidth={'1px'}
                    disabled={
                      proposalLoading ||
                      votesLoading ||
                      proposal.state === 'closed'
                    }
                    rounded={'full'}
                    _focus={{
                      borderColor: 'blue.600',
                    }}
                    _hover={{
                      bg: 'blue.100',
                    }}
                    onClick={handleVote}
                  >
                    Vote
                  </Button>
                </Stack>
              </Card>

              {/* all the votes */}
              <Card title={`Votes(${votes.length})`}>
                <Stack spacing={4} direction={'column'}>
                  {sortedVotes &&
                    sortedVotes.map((vote, index) => (
                      <SimpleGrid columns={3} key={`i-${index}`} spacing={10}>
                        <LinkExternal
                          type={'vote'}
                          value={shortenAddress(vote.voter)}
                        />
                        <Text textAlign={'center'}>
                          {proposal.choices[vote.choice - 1]}
                        </Text>
                        <Text textAlign={'right'}>{`${getFormatedValue(
                          vote.balance
                        )} ${space.symbol}`}</Text>
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
                    <LinkExternal
                      type={'proposal'}
                      value={shortenProposalId(proposal.id)}
                    />

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
                    <Text>
                      {format(
                        new Date(proposal.start * 1000),
                        'yyyy-MM-dd HH:mm'
                      )}
                    </Text>

                    {/* end date */}
                    <Text>End Date</Text>
                    <Text>
                      {format(
                        new Date(proposal.end * 1000),
                        'yyyy-MM-dd HH:mm'
                      )}
                    </Text>
                  </SimpleGrid>
                </Stack>
              </Card>

              {/* current results */}
              <Card title={'Current Results'}>
                <Stack spacing={2} direction={'column'}>
                  {proposal.choices.map((choice, index) => {
                    const balance = getPercentage(
                      results.resultsByVoteBalance[index],
                      results.sumOfResultsBalance
                    );
                    return (
                      <>
                        <Text>{choice}</Text>
                        <Progress min={0} max={100} value={balance}></Progress>
                        <Text>{`${getFormatedValue(
                          results.resultsByVoteBalance[index]
                        )} ${space.symbol}`}</Text>
                        <Spacer />
                      </>
                    );
                  })}
                </Stack>
              </Card>

              <Button
                bg={'blue.100'}
                borderWidth={'1px'}
                disabled={
                  proposalLoading ||
                  votesLoading ||
                  proposal.state !== 'closed' ||
                  isExecuting
                }
                rounded={'full'}
                _focus={{
                  borderColor: 'blue.600',
                }}
                _hover={{
                  bg: 'blue.100',
                }}
                onClick={handleExecuteProposal}
              >
                Execute Proposal
              </Button>
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
