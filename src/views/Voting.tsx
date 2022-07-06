import { RepeatIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Container,
  Heading,
  IconButton,
  Progress,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { ProposalState, Snapshot, SupportedChainId } from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

import {
  ConnectWalletButton,
  LinkButton,
  PrimaryButton,
} from '../components/Button';
import Card from '../components/Card';
import { EventCountDown } from '../components/CountDown';
import { Loader } from '../components/Loader';
import ReactMarkdown from '../components/ReactMarkDown';
import {
  getFormatedValue,
  getFullDisplayBalance,
} from '../config/constants/number';
import { ProposalStateText } from '../config/constants/text';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { getExternalLink } from '../utils/address';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';

const MAX_VISIBLE_COUNT = 10;

// const getFormatedValue = (value) =>
//   parseFloat(value).toLocaleString(undefined, {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 3,
//     minimumSignificantDigits: 1,
//     maximumSignificantDigits: 4,
//   });

const getPercentage = (scores: string[], index: number) => {
  const sum = scores.reduce(
    (prev, current) => prev.plus(new BigNumber(current)),
    new BigNumber(0)
  );
  if (sum.eq(new BigNumber(0))) return 0;
  return new BigNumber(scores[index])
    .multipliedBy(new BigNumber(100))
    .dividedBy(sum)
    .toNumber();
};

const Voting = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const { zNA, proposalId } = useParams();
  const toast = useToast();

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

  const [myChoice, setMyChoice] = useState(-1);
  const [isProcessingTx, setProcessingTx] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const zDAO = useCurrentZDAO(zNA);

  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposal, setProposal] = useState<
    Snapshot.SnapshotProposal | undefined
  >();
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<Snapshot.SnapshotVote[] | undefined>();
  const [votingPower, setVotingPower] = useState<string | undefined>('');

  const handleRefreshPage = useCallback(async () => {
    if (!zDAO || !proposalId) return;

    setProposalLoading(true);
    const item = await zDAO.getProposal(proposalId);
    setProposal(item as Snapshot.SnapshotProposal);

    if (account) {
      const vp = await item.getVotingPowerOfUser(account);
      console.log('vp', vp);
      setVotingPower(vp);
    }

    setProposalLoading(false);
    console.log('proposal', item);
  }, [account, zDAO, proposalId]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleRefreshPage();
  }, [handleRefreshPage]);

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO || !proposal) return;

      const items = await proposal.listVotes();
      console.log('votes', items);
      setVotes(items);
      setVotesLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [proposal, zDAO]);

  const alreadyVoted = useMemo(() => {
    if (!votes) return false;
    if (votes.find((vote) => vote.voter === account) !== undefined) {
      return true;
    }
    return false;
  }, [votes, account]);

  const sortedVotes = useMemo(() => {
    if (!votes) {
      return undefined;
    }
    return showAll ? votes : votes.slice(0, MAX_VISIBLE_COUNT);
  }, [votes, showAll]);

  const handleVote = useCallback(async () => {
    if (!zDAO || !library || !account || !proposal) return;

    setProcessingTx(true);
    try {
      if (!votingPower || new BigNumber(votingPower).eq(new BigNumber(0))) {
        toast({
          title: 'Only token holders can cast a vote',
          position: 'top-right',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (myChoice >= 0) {
        await proposal.vote(library, account, { choice: myChoice + 1 });
        if (toast) {
          toast({
            title: 'Success',
            description: "You've casted your vote. Updating page now ...",
            status: 'success',
            duration: 4000,
            isClosable: true,
          });
        }
        // await proposal.updateScoresAndVotes();
        await handleRefreshPage();
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
  }, [zDAO, library, account, proposal, toast, handleRefreshPage, myChoice]);

  const handleExecuteProposal = useCallback(async () => {
    if (!library || !account || !proposal) return;
    setProcessingTx(true);
    try {
      await proposal.execute(library, account, {});
      if (toast) {
        toast({
          title: 'Success',
          description: 'Proposal has been executed. Updating page now ...',
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      await handleRefreshPage();
    } catch (error: any) {
      console.error('Execute proposal', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Executing proposal failed - ${
            error.data?.message ?? error.message
          }`,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setProcessingTx(false);
  }, [library, account, proposal, handleRefreshPage, toast]);

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link to={`/${zNA}`}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        {!zDAO || proposalLoading || !proposal ? (
          <Stack justifyContent="center">
            <Loader />
          </Stack>
        ) : (
          <>
            <IconButton
              variant="outline"
              aria-label="Refresh"
              fontSize="20px"
              icon={<RepeatIcon />}
              onClick={handleRefreshPage}
            />
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
                {proposal.metadata && (
                  <Stack spacing={2}>
                    <Text color={textColor}>
                      {`Let's send 
                      ${getFullDisplayBalance(
                        new BigNumber(proposal.metadata.amount),
                        proposal.metadata.decimals
                      )}
                  token to this address: `}
                      <LinkButton
                        href={getExternalLink(
                          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                          chainId!,
                          'address',
                          proposal.metadata.recipient
                        )}
                        isExternal
                      >
                        {proposal.metadata.recipient}
                      </LinkButton>
                    </Text>
                    <Text color={textColor}>
                      {`ERC20 token address: `}
                      {proposal.metadata.token.length > 0 ? (
                        <LinkButton
                          href={getExternalLink(
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            chainId!,
                            'address',
                            proposal.metadata.token
                          )}
                          isExternal
                        >
                          {proposal.metadata.token}
                        </LinkButton>
                      ) : (
                        'ETH'
                      )}
                    </Text>
                  </Stack>
                )}

                {/* cast my vote */}
                {proposal.state === ProposalState.ACTIVE && !alreadyVoted && (
                  <Card title={'Cast your vote'}>
                    <Stack spacing={2} direction={'column'}>
                      {account ? (
                        <>
                          {votingPower && (
                            <Stack spacing={2} direction="row">
                              <Text>Your Voting Power</Text>
                              <Text>
                                {getFullDisplayBalance(
                                  new BigNumber(votingPower),
                                  0
                                )}
                              </Text>
                            </Stack>
                          )}
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
                              proposal.state !== ProposalState.ACTIVE ||
                              chainId !== SupportedChainId.RINKEBY ||
                              isProcessingTx
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
                <Card
                  title={
                    proposal.voters !== undefined
                      ? `Votes(${proposal.voters})`
                      : 'Votes'
                  }
                >
                  <Stack spacing={4} direction={'column'}>
                    {sortedVotes &&
                      sortedVotes.map((vote, index) => (
                        <SimpleGrid columns={3} key={`i-${index}`} spacing={10}>
                          <LinkExternal
                            chainId={SupportedChainId.RINKEBY}
                            type={ExternalLinkType.address}
                            value={vote.voter}
                          />
                          <Text textAlign="center">
                            {proposal.choices[vote.choice - 1]}
                          </Text>
                          <Text textAlign="right">
                            {getFormatedValue(vote.votes)}
                          </Text>
                        </SimpleGrid>
                      ))}
                    {!showAll && votes && MAX_VISIBLE_COUNT < votes.length && (
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
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.proposal}
                        value={proposal.id}
                      />

                      {/* creator */}
                      {account && (
                        <>
                          <Text>Creator</Text>
                          <LinkExternal
                            chainId={SupportedChainId.RINKEBY}
                            type={ExternalLinkType.address}
                            value={proposal.createdBy}
                          />
                        </>
                      )}

                      <Text>Voting Token</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.address}
                        value={zDAO.votingToken.token}
                      />

                      {/* snapshot */}
                      <Text>Snapshot</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.block}
                        value={proposal.snapshot ?? 0}
                      />

                      {/* status */}
                      <Badge
                        textAlign="center"
                        rounded="full"
                        p="1"
                        fontSize="0.8em"
                        colorScheme="red"
                      >
                        {proposal.state}
                      </Badge>
                      <Text>{ProposalStateText(proposal.state)}</Text>

                      {/* start date */}
                      <Text>Start Date</Text>
                      <Text>
                        {proposal.start
                          ? format(proposal.start, 'yyyy-MM-dd HH:mm')
                          : '...'}
                      </Text>

                      {/* end date */}
                      <Text>End Date</Text>
                      <Text>
                        {proposal.end
                          ? format(proposal.end, 'yyyy-MM-dd HH:mm')
                          : '...'}
                      </Text>

                      {/* count down */}
                      {proposal.state === ProposalState.ACTIVE && proposal.end && (
                        <>
                          <Text>Remain Date:</Text>
                          <EventCountDown
                            nextEventTime={Math.floor(
                              proposal.end.getTime() / 1000
                            )}
                            postCountDownText="until executing proposal"
                          />
                        </>
                      )}
                    </SimpleGrid>
                  </Stack>
                </Card>

                {/* current results */}
                <Card title={'Current Results'}>
                  <Stack spacing={2} direction={'column'}>
                    {proposal.choices.map((choice, index) => (
                      <div key={choice}>
                        <Text>{proposal.choices[index]}</Text>
                        {proposal.state !== ProposalState.PENDING &&
                        proposal.scores ? (
                          <>
                            <Progress
                              borderRadius="full"
                              min={0}
                              max={100}
                              value={getPercentage(proposal.scores, index)}
                            />
                            <Text>{proposal.scores[index]}</Text>
                          </>
                        ) : (
                          <Loader />
                        )}

                        <Spacer />
                      </div>
                    ))}

                    <SimpleGrid
                      columns={2}
                      spacing={4}
                      templateColumns={{ base: '1fr 2fr' }}
                    >
                      <Text>Total Voters</Text>
                      {proposal.state !== ProposalState.PENDING ? (
                        <Text>{proposal.voters}</Text>
                      ) : (
                        <Loader />
                      )}
                      <Text>Total Votes</Text>
                      {proposal.state !== ProposalState.PENDING &&
                      proposal.scores ? (
                        <Text>
                          {new BigNumber(proposal.scores[0])
                            .plus(new BigNumber(proposal.scores[1]))
                            .toString()}
                        </Text>
                      ) : (
                        <Loader />
                      )}
                    </SimpleGrid>
                  </Stack>
                </Card>

                <Box pt={1} />
                <PrimaryButton
                  disabled={
                    proposalLoading ||
                    votesLoading ||
                    !account ||
                    proposal.state !== ProposalState.CLOSED ||
                    isProcessingTx
                  }
                  onClick={handleExecuteProposal}
                >
                  Execute Proposal
                </PrimaryButton>
                <Spacer pt={2} />
              </Stack>
            </Stack>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default Voting;
