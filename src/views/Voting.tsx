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
import { Proposal, SupportedChainId, Vote } from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { format } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
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
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { getExternalLink } from '../utils/address';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';

const MAX_VISIBLE_COUNT = 10;

const getPercentage = (scores: string[], index: number) => {
  const sum = scores.reduce(
    (prev, current) => prev.plus(new BigNumber(current)),
    new BigNumber(0),
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

  const textColor = useColorModeValue('gray.700', 'gray.400');
  const voteHoverBorderColor = useColorModeValue(
    'blue.600',
    'rgb(145, 85, 230)',
  );
  const voteBorderColor = useColorModeValue('gray.200', 'gray.600');
  const voteSelectedBorderColor = useColorModeValue(
    'blue.600',
    'rgb(145, 85, 230)',
  );
  const voteSelectedTextColor = useColorModeValue('black', 'white');

  const [myChoice, setMyChoice] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const toast = useToast();

  const zDAO = useCurrentZDAO(zNA);

  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposal, setProposal] = useState<Proposal | undefined>();
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<Vote[] | undefined>();

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO || !proposalId) return;

      const item = await zDAO.getProposal(proposalId);
      console.log('proposal', item);
      setProposal(item);
      setProposalLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [zDAO, proposalId]);

  useEffect(() => {
    const fetch = async () => {
      if (!proposal) return;

      const items = await proposal.listVotes();
      console.log('votes', items);
      setVotes(items);
      setVotesLoading(false);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [proposal]);

  const alreadyVoted = useMemo(() => {
    if (!votes) return false;
    if (votes.find((vote) => vote.voter === account) !== undefined) {
      return true;
    }
    return false;
  }, [votes, account]);

  const sortedVotes = useMemo(() => {
    if (!votes) return undefined;

    return showAll ? votes : votes.slice(0, MAX_VISIBLE_COUNT);
  }, [votes, showAll]);

  const canExecute = proposal?.canExecute();

  const handleVote = () => {
    console.log('vote');
  };

  const handleExecuteProposal = async () => {
    console.log('execute proposal');
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to={`/${zNA}`}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        {proposalLoading || !proposal ? (
          <Stack justifyContent="center">
            <Loader />
          </Stack>
        ) : (
          <Stack
            spacing={12}
            flex={2}
            direction={{ base: 'column', sm: 'row' }}
            w="full"
          >
            <Stack direction="column" spacing={6} flex={1}>
              <Heading textAlign="left">{proposal.title}</Heading>
              <Box style={{ overflow: 'hidden' }}>
                <ReactMarkdown>{proposal.body}</ReactMarkdown>
              </Box>
              {proposal.metadata && (
                <Stack spacing={2}>
                  <Text color={textColor}>
                    {`Let's send
                  ${getFullDisplayBalance(
                    new BigNumber(proposal.metadata.amount),
                    proposal.metadata.decimals,
                  )}
                  token to this address: `}
                    <LinkButton
                      href={getExternalLink(
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        chainId!,
                        'address',
                        proposal.metadata.recipient,
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
                          proposal.metadata.token,
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

              {proposal.state === 'active' && (
                <Card title="Cast your vote">
                  <Stack spacing={2} direction="column">
                    {account ? (
                      <>
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
                            {choice}
                          </Button>
                        ))}
                        <PrimaryButton
                          disabled={
                            proposalLoading ||
                            votesLoading ||
                            proposal.state !== 'active'
                          }
                          rounded="full"
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

              <Card
                title={proposal.voters ? `Votes(${proposal.voters})` : 'Votes'}
              >
                <Stack spacing={4} direction="column">
                  {votesLoading || !sortedVotes ? (
                    <Loader />
                  ) : (
                    sortedVotes.map((vote) => (
                      <SimpleGrid columns={3} key={vote.voter} spacing={10}>
                        <LinkExternal
                          chainId={SupportedChainId.MUMBAI}
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
                    ))
                  )}
                  {!showAll && votes && MAX_VISIBLE_COUNT < votes.length && (
                    <LinkButton
                      textAlign="center"
                      width="full"
                      onClick={handleShowAll}
                    >
                      Show All
                    </LinkButton>
                  )}
                </Stack>
              </Card>
            </Stack>

            <Stack direction="column" width={{ base: 'full', sm: '400px' }}>
              <Card title="Details">
                <Stack spacing={2} direction="column">
                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 2fr' }}
                  >
                    <Text>Identifier</Text>
                    {proposal.id}

                    {account && (
                      <>
                        <Text>Creator</Text>
                        <LinkExternal
                          chainId={SupportedChainId.GOERLI}
                          type={ExternalLinkType.address}
                          value={proposal.createdBy}
                        />
                      </>
                    )}

                    <Text>Snapshot</Text>
                    <LinkExternal
                      chainId={SupportedChainId.MUMBAI}
                      type={ExternalLinkType.block}
                      value={proposal.snapshot}
                    />

                    <Badge
                      textAlign="center"
                      rounded="full"
                      p="1"
                      fontSize="0.8em"
                      colorScheme="red"
                    >
                      {proposal.state}
                    </Badge>
                    <Spacer />

                    <Text>Start Date</Text>
                    <Text>
                      {proposal.start
                        ? format(proposal.start, 'yyyy-MM-dd HH:mm')
                        : '...'}
                    </Text>

                    <Text>End Date</Text>
                    <Text>
                      {proposal.end
                        ? format(proposal.end, 'yyyy-MM-dd HH:mm')
                        : '...'}
                    </Text>

                    {proposal.state === 'active' && proposal.end && (
                      <>
                        <Text>Remain Date:</Text>
                        <EventCountDown
                          nextEventTime={Math.floor(
                            proposal.end.getTime() / 1000,
                          )}
                          postCountDownText="until executing proposal"
                        />
                      </>
                    )}
                  </SimpleGrid>
                </Stack>
              </Card>

              <Card title="Current Results">
                <Stack spacing={2} direction="column">
                  {proposal.choices.map((choice, index) => (
                    <div key={choice}>
                      <Text>{choice}</Text>
                      {proposal.scores ? (
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
                </Stack>
              </Card>
              <Box pt={1} />
              <PrimaryButton
                disabled={
                  proposalLoading ||
                  votesLoading ||
                  proposal.state !== 'collected' ||
                  isExecuting ||
                  !canExecute
                }
                onClick={handleExecuteProposal}
              >
                Execute Proposal
              </PrimaryButton>
              <Spacer pt={2} />
            </Stack>
          </Stack>
        )}
      </VStack>
    </Container>
  );
};

export default Voting;
