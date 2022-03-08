import { BIG_EITEEN } from '@/config/constants/number';
import {
  ConnectWalletButton,
  LinkButton,
  PrimaryButton,
} from '@/components/Button';
import Card from '@/components/Card';
import { EventCountDown } from '@/components/CountDown';
import { SAFE_ADDRESS, SAFE_SERVICE_URL } from '@/config/constants/gnosis-safe';
import { SPACE_ID } from '@/config/constants/snapshot';
import { getPower } from '@/helpers/snapshot';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useClient from '@/hooks/useClient';
import useExtendedIpfs from '@/hooks/useExtendedIpfs';
import useExtendedProposal from '@/hooks/useExtendedProposal';
import useExtendedResults from '@/hooks/useExtendedResults';
import useExtendedSpace from '@/hooks/useExtendedSpace';
import useExtendedVotes from '@/hooks/useExtendedVotes';
import { getExternalLink } from '@/utils/address';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
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
import { format } from 'date-fns';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useParams } from 'react-router-dom';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';
import ReactMarkdown from '@/components/ReactMarkDown';

const MAX_VISIBLE_COUNT = 10;

const getFormatedValue = (value) =>
  parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  });
const getPercentage = (n, max) => (max ? (100 / max) * n : 0);

const Voting = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const { sendEIP712 } = useClient();
  const textColor = useColorModeValue('gray.700', 'gray.400');
  const voteHoverBorderColor = useColorModeValue(
    'blue.600',
    'rgb(145, 85, 230)'
  );
  const voteBorderColor = useColorModeValue('gray.200', 'gray.600');
  const voteSelectedBorderColor = useColorModeValue(
    'blue.600',
    'rgb(145, 85, 230)'
  );
  const voteSelectedTextColor = useColorModeValue('black', 'white');

  const { id: proposalId } = useParams();
  const { space } = useExtendedSpace(SPACE_ID);
  const { proposal, proposalLoading } = useExtendedProposal(proposalId);
  const { votes, votesLoading } = useExtendedVotes(proposalId);
  const { results, votes: votesEx } = useExtendedResults(
    space,
    proposal,
    votes
  );
  const { metaData, ipfsLoading } = useExtendedIpfs(proposal?.ipfs);
  const [myChoice, setMyChoice] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const toast = useToast();

  const alreadyVoted = useMemo(() => {
    if (!votesEx) return false;
    if (votesEx.find((vote) => vote.voter === account) !== undefined) {
      return true;
    }
    return false;
  }, [votesEx]);

  const sortedVotes = useMemo(() => {
    if (!votesEx) {
      return undefined;
    }
    return showAll ? votesEx : votesEx.slice(0, MAX_VISIBLE_COUNT);
  }, [votesEx, showAll]);

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
        if (result && result.id) {
          toast({
            title: 'You can cast your vote',
            position: 'top-right',
            duration: 3000,
            isClosable: true,
          });
          window.location.reload();
        }
      } else {
        toast({
          title: 'Please select a choice to cast your vote',
          position: 'top-right',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleExecuteProposal = async () => {
    console.log('handleExecuteProposal');
    if (!account || !library || ipfsLoading) return;

    if (proposal.state !== 'closed') {
      toast({
        title: 'Proposal voting period has not ended yet',
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!metaData) {
      toast({
        title: 'Token transfer information not found',
        position: 'top-right',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsExecuting(true);
    try {
      console.log('abi', metaData.abi);
      console.log('sender', metaData.sender);
      console.log('recipient', metaData.recipient);
      console.log('token', metaData.token);
      console.log('amount', metaData.amount.toString());

      console.log('Safe Service Url', SAFE_SERVICE_URL);
      console.log('Safe Address', SAFE_ADDRESS);
      const service = new SafeService(SAFE_SERVICE_URL);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: library?.getSigner(),
      });
      const safe = await Safe.create({ ethAdapter, safeAddress: SAFE_ADDRESS });
      const owners = await safe.getOwners();
      if (!owners.find((owner) => owner === account)) {
        toast({
          title: 'Only Gnosis Safe Owners can execute a proposal',
          position: 'top-right',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const safeSigner = new SafeEthersSigner(safe, service, library);
      const transferContract = new ethers.Contract(
        metaData.token,
        metaData.abi,
        safeSigner
      );
      console.log('transferContract', transferContract);
      const proposedTx = await transferContract
        .connect(safeSigner)
        .transfer(metaData.recipient, metaData.amount.toString());
      console.log('USER ACTION REQUIRED');
      console.log('Go to the Gnosis Safe Web App to confirm the transaction');
      console.log(await proposedTx.wait());
      console.log('Transaction has been executed');
    } finally {
      setIsExecuting(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <LinkButton href={'/'}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </LinkButton>

        {proposal && sortedVotes && !ipfsLoading ? (
          <Stack
            spacing={12}
            flex={2}
            direction={{ base: 'column', sm: 'row' }}
            w={'full'}
          >
            <Stack direction={'column'} spacing={6} flex={1}>
              {/* title, body */}
              <Heading textAlign={'left'}>{proposal.title}</Heading>
              <Box style={{ overflow: 'hidden' }}>
                <ReactMarkdown>{proposal.body}</ReactMarkdown>
              </Box>
              {/* proposal execution meta data */}
              {!metaData ||
              metaData.amount.isNaN() ||
              !metaData.token ||
              !metaData.recipient ? (
                <></>
              ) : (
                <Stack spacing={2}>
                  <Text color={textColor}>
                    {`Let's send 
                  ${metaData.amount.dividedBy(BIG_EITEEN).toFixed(2)} 
                  token to this address: `}
                    <LinkButton
                      href={getExternalLink(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chainId!,
                        'address',
                        metaData.recipient
                      )}
                      isExternal
                    >
                      {metaData.recipient}
                    </LinkButton>
                  </Text>
                  <Text color={textColor}>
                    {`ERC20 token address: `}
                    <LinkButton
                      href={getExternalLink(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chainId!,
                        'address',
                        metaData.token
                      )}
                      isExternal
                    >
                      {metaData.token}
                    </LinkButton>
                  </Text>
                </Stack>
              )}

              {/* cast my vote */}
              {proposal.state === 'active' && !alreadyVoted && (
                <Card title={'Cast your vote'}>
                  <Stack spacing={2} direction={'column'}>
                    {account ? (
                      <>
                        {proposal.choices.map((choice, index) => (
                          <Button
                            key={index}
                            bg={'transparent'}
                            borderColor={
                              index === myChoice
                                ? voteSelectedBorderColor
                                : voteBorderColor
                            }
                            borderWidth={'1px'}
                            color={
                              index === myChoice
                                ? voteSelectedTextColor
                                : textColor
                            }
                            rounded={'full'}
                            _focus={{
                              borderColor: voteHoverBorderColor,
                            }}
                            _hover={{
                              borderColor: voteHoverBorderColor,
                            }}
                            onClick={() => setMyChoice(index)}
                          >
                            {choice}
                          </Button>
                        ))}
                        <PrimaryButton
                          disabled={
                            proposalLoading ||
                            votesLoading ||
                            proposal.state !== 'active'
                          }
                          rounded={'full'}
                          onClick={handleVote}
                        >
                          Vote
                        </PrimaryButton>
                      </>
                    ) : (
                      <ConnectWalletButton />
                    )}
                  </Stack>
                </Card>
              )}

              {/* all the votes */}
              <Card title={`Votes(${votes.length})`}>
                <Stack spacing={4} direction={'column'}>
                  {sortedVotes &&
                    sortedVotes.map((vote, index) => (
                      <SimpleGrid columns={3} key={`i-${index}`} spacing={10}>
                        <LinkExternal
                          type={ExternalLinkType.address}
                          value={vote.voter}
                        />
                        <Text textAlign={'center'}>
                          {proposal.choices[vote.choice - 1]}
                        </Text>
                        <Text textAlign={'right'}>{`${getFormatedValue(
                          vote.balance
                        )} ${space.symbol}`}</Text>
                      </SimpleGrid>
                    ))}
                  {!showAll && MAX_VISIBLE_COUNT < votesEx.length && (
                    <LinkButton
                      textAlign={'center'}
                      width={'full'}
                      onClick={handleShowAll}
                    >
                      Show All
                    </LinkButton>
                  )}
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
                      type={ExternalLinkType.proposal}
                      value={proposal.id}
                    />

                    {/* creator */}
                    {account && (
                      <>
                        <Text>Creator</Text>
                        <LinkExternal
                          type={ExternalLinkType.address}
                          value={proposal.author}
                        />
                      </>
                    )}

                    {/* snapshot */}
                    <Text>Snapshot</Text>
                    <LinkExternal
                      type={ExternalLinkType.block}
                      value={proposal.snapshot}
                    />

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

                    {/* count down */}
                    {proposal.state === 'active' && (
                      <>
                        <Text>Remain Date:</Text>
                        <EventCountDown
                          nextEventTime={proposal.end}
                          postCountDownText={'until executing proposal'}
                        />
                      </>
                    )}
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
                      <div key={index}>
                        <Text>{choice}</Text>
                        <Progress
                          borderRadius={'full'}
                          min={0}
                          max={100}
                          value={balance}
                        ></Progress>
                        <Text>{`${getFormatedValue(
                          results.resultsByVoteBalance[index]
                        )} ${space.symbol}`}</Text>
                        <Spacer />
                      </div>
                    );
                  })}
                </Stack>
              </Card>
              <Box pt={1} />
              <PrimaryButton
                disabled={
                  proposalLoading ||
                  votesLoading ||
                  proposal.state !== 'closed' ||
                  isExecuting
                }
                onClick={handleExecuteProposal}
              >
                Execute Proposal
              </PrimaryButton>
              <Spacer pt={2} />
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
