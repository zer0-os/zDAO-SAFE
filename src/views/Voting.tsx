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
import {
  Proposal,
  ProposalState,
  SupportedChainId,
  Vote,
} from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import {
  ConnectWalletButton,
  LinkButton,
  PrimaryButton,
} from '@/components/Button';
import Card from '@/components/Card';
import { EventCountDown } from '@/components/CountDown';
import { Loader } from '@/components/Loader';
import ReactMarkdown from '@/components/ReactMarkDown';
import {
  extendToDecimals,
  getFullDisplayBalance,
} from '@/config/constants/number';
import { ProposalStateText } from '@/config/constants/text';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useCurrentZDAO from '@/hooks/useCurrentZDAO';
import { getExternalLink } from '@/utils/address';
import { setupNetwork } from '@/utils/wallet';

import LinkExternal, { ExternalLinkType } from './components/LinkExternal';

const MAX_VISIBLE_COUNT = 10;

const getPercentage = (scores: number[], index: number) => {
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
  const borderColor = useColorModeValue('gray.200', 'gray.600');
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
  const [proposal, setProposal] = useState<Proposal | undefined>();
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<Vote[] | undefined>();
  const [votingPower, setVotingPower] = useState<number | undefined>(undefined);

  const handleRefreshPage = useCallback(async () => {
    if (!zDAO || !proposalId) return;

    setProposalLoading(true);
    const item = await zDAO.getProposal(proposalId);
    setProposal(item);

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

  const handleRefreshVotes = useCallback(async () => {
    if (!zDAO || !proposal) return;

    setVotesLoading(true);
    const items = await proposal.listVotes();
    console.log('votes', items);
    setVotes(items);
    setVotesLoading(false);
  }, [zDAO, proposal]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleRefreshVotes();
  }, [handleRefreshVotes]);

  const alreadyVoted = useMemo(() => {
    // if (!votes) retuf
    return false;
  }, [votes, account]);

  const sortedVotes = useMemo(() => {
    if (!votes) return undefined;

    return showAll ? votes : votes.slice(0, MAX_VISIBLE_COUNT);
  }, [votes, showAll]);

  const handleVote = useCallback(async () => {
    if (!zDAO || !library || !account || !proposal) return;
    setProcessingTx(true);
    try {
      await proposal.vote(library, account, myChoice + 1);
      if (toast) {
        toast({
          title: 'Success',
          description: "You've casted your vote. Updating page now ...",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
      await proposal.updateScoresAndVotes();
      handleRefreshVotes();
    } catch (error: any) {
      console.error('Vote', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Casting vote failed - ${
            error.data?.message ?? error.message
          }`,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setProcessingTx(false);
  }, [zDAO, library, account, proposal, toast, myChoice, handleRefreshVotes]);

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <LinkButton to={`/${zNA}`}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </LinkButton>

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
                    </Text>
                    <LinkButton
                      to={getExternalLink(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chainId!,
                        'address',
                        proposal.metadata.recipient
                      )}
                      isExternal
                    >
                      {proposal.metadata.recipient}
                    </LinkButton>
                    <Text color={textColor}>{`ERC20 token address: `}</Text>
                    {proposal.metadata.token.length > 0 ? (
                      <LinkButton
                        to={getExternalLink(
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
                  </Stack>
                )}

                {/* cast my vote */}
                {proposal.state === ProposalState.ACTIVE && !alreadyVoted && (
                  <Card title={'Cast your vote'}>
                    <Stack spacing={2} direction={'column'}>
                      {account ? (
                        <>
                          {votingPower !== undefined && (
                            <Stack spacing={2} direction="row">
                              <Text>Your Voting Power</Text>
                              <Text>
                                {getFullDisplayBalance(
                                  extendToDecimals(
                                    zDAO.votingToken.decimals
                                  ).multipliedBy(new BigNumber(votingPower)),
                                  zDAO.votingToken.decimals
                                )}
                              </Text>
                            </Stack>
                          )}
                          {proposal.choices.map((choice, index) => (
                            <Button
                              key={choice}
                              bg="transparent"
                              borderColor={
                                index === myChoice
                                  ? voteSelectedBorderColor
                                  : voteBorderColor
                              }
                              borderWidth="1px"
                              color={
                                index === myChoice
                                  ? voteSelectedTextColor
                                  : textColor
                              }
                              rounded="full"
                              _focus={{
                                borderColor: voteHoverBorderColor,
                              }}
                              _hover={{
                                borderColor: voteHoverBorderColor,
                              }}
                              onClick={() => setMyChoice(index)}
                            >
                              {proposal.choices[index]}
                            </Button>
                          ))}

                          <SimpleGrid
                            columns={2}
                            spacing={4}
                            templateColumns={{
                              base:
                                chainId && chainId !== SupportedChainId.RINKEBY
                                  ? '1fr 2fr'
                                  : '1fr',
                            }}
                            alignItems="center"
                          >
                            {chainId && chainId !== SupportedChainId.RINKEBY && (
                              <Button
                                borderWidth="1px"
                                borderRadius="md"
                                px={4}
                                py={2}
                                _hover={{
                                  borderColor,
                                }}
                                onClick={() =>
                                  // eslint-disable-next-line prettier/prettier
                                  setupNetwork(SupportedChainId.RINKEBY)
                                }
                              >
                                <Heading size="sm">Switch to Mumbai</Heading>
                              </Button>
                            )}

                            <PrimaryButton
                              disabled={
                                proposalLoading ||
                                votesLoading ||
                                proposal.state !== ProposalState.ACTIVE ||
                                chainId !== SupportedChainId.RINKEBY ||
                                isProcessingTx
                              }
                              width="full"
                              rounded="full"
                              onClick={handleVote}
                            >
                              Vote
                            </PrimaryButton>
                          </SimpleGrid>
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
                    proposal.votes !== undefined
                      ? `Votes(${proposal.votes})`
                      : 'Votes'
                  }
                >
                  <Stack spacing={4} direction={'column'}>
                    {votesLoading ||
                    !sortedVotes ||
                    proposal.state === ProposalState.PENDING ? (
                      <Loader />
                    ) : (
                      sortedVotes &&
                      sortedVotes.map((vote) => (
                        <SimpleGrid columns={3} key={vote.voter} spacing={10}>
                          <LinkExternal
                            chainId={SupportedChainId.RINKEBY}
                            type={ExternalLinkType.address}
                            value={vote.voter}
                          />
                          <Text textAlign="center">
                            {proposal.choices[vote.choice - 1]}
                          </Text>
                          <Text textAlign="right">
                            {getFullDisplayBalance(
                              extendToDecimals(
                                zDAO.votingToken.decimals
                              ).multipliedBy(new BigNumber(vote.power)),
                              zDAO.votingToken.decimals
                            )}
                          </Text>
                        </SimpleGrid>
                      ))
                    )}
                    {!showAll && votes && MAX_VISIBLE_COUNT < votes.length && (
                      <Button
                        textAlign="center"
                        width="full"
                        onClick={handleShowAll}
                      >
                        Show All
                      </Button>
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
                            value={proposal.author}
                          />
                        </>
                      )}

                      <Text>Voting Token</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.address}
                        value={zDAO.votingToken.token}
                      />

                      <Text>Voting Type</Text>
                      <Text>
                        {zDAO.isRelativeMajority
                          ? 'Relative Majority'
                          : 'Absolute Majority'}
                      </Text>

                      <Text>Minimum Voting Participants</Text>
                      <Text>{zDAO.minimumVotingParticipants}</Text>

                      <Text>Minimum Total Voting Tokens</Text>
                      <Text>
                        {getFullDisplayBalance(
                          new BigNumber(zDAO.minimumTotalVotingTokens),
                          zDAO.votingToken.decimals
                        )}
                      </Text>

                      {/* snapshot */}
                      <Text>Snapshot</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.block}
                        value={proposal.snapshot}
                      />

                      {/* status */}
                      <Badge
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        textAlign="center"
                        rounded="full"
                        p="1"
                        fontSize="0.8em"
                        colorScheme="red"
                      >
                        {proposal.state}
                      </Badge>
                      <Text alignItems="center">
                        {ProposalStateText(proposal.state)}
                      </Text>

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
                            <Text>
                              {getFullDisplayBalance(
                                new BigNumber(proposal.scores[index]),
                                zDAO.votingToken.decimals
                              )}
                            </Text>
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
                        <Text>{proposal.votes}</Text>
                      ) : (
                        <Loader />
                      )}
                      <Text>Total Votes</Text>
                      {proposal.state !== ProposalState.PENDING &&
                      proposal.scores ? (
                        <Text>
                          {getFullDisplayBalance(
                            new BigNumber(proposal.scores[0]).plus(
                              new BigNumber(proposal.scores[1])
                            ),
                            zDAO.votingToken.decimals
                          )}
                        </Text>
                      ) : (
                        <Loader />
                      )}
                    </SimpleGrid>
                  </Stack>
                </Card>
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
