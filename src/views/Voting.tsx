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
import { Choice, Proposal, SupportedChainId, Vote } from '@zero-tech/zdao-sdk';
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
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
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
  const borderColor = useColorModeValue('gray.200', 'gray.600');
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
  const [isProcessingTx, setProcessingTx] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const toast = useToast();

  const zDAO = useCurrentZDAO(zNA);

  const [proposalLoading, setProposalLoading] = useState(true);
  const [proposal, setProposal] = useState<Proposal | undefined>();
  const [votesLoading, setVotesLoading] = useState(true);
  const [votes, setVotes] = useState<Vote[] | undefined>();
  const [collectHashesLoading, setCollectHashesLoading] = useState<boolean>(
    true,
  );
  const [collectedHashes, setCollectedHashes] = useState<
    | {
        hash: string;
        isCheckPointed: boolean;
      }[]
    | undefined
  >();

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
      if (!zDAO || !proposal) return;

      const items = await proposal.listVotes();
      console.log('votes', items);
      setVotes(items);
      setVotesLoading(false);

      const hashes = await proposal.collectTxHash();
      console.log('collected hashes', hashes);

      const promises: Promise<boolean>[] = hashes.map((hash) =>
        zDAO.isCheckPointed(hash),
      );
      const checked = await Promise.all(promises);
      setCollectedHashes(
        hashes.map((hash, index) => ({
          hash,
          isCheckPointed: checked[index],
        })),
      );
      setCollectHashesLoading(false);
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
    if (!votes) return undefined;

    return showAll ? votes : votes.slice(0, MAX_VISIBLE_COUNT);
  }, [votes, showAll]);

  const handleVote = async () => {
    if (!zDAO || !library || !proposal) return;
    setProcessingTx(true);
    await proposal.vote(library.getSigner(), (myChoice + 1) as Choice); // proposal.choices[myChoice]); // todo
    setProcessingTx(false);
  };

  const handleCollectProposal = async () => {
    if (!zDAO || !library || !proposal) return;
    setProcessingTx(true);
    await proposal.collect(library.getSigner());
    setProcessingTx(false);
  };

  const handleReceiveCollectProposal = async (txhash: string) => {
    if (!zDAO || !library) return;
    setProcessingTx(true);
    await zDAO.syncState(library.getSigner(), txhash);
    setProcessingTx(false);
  };

  const handleExecuteProposal = async () => {
    if (!zDAO || !library || !proposal) return;
    setProcessingTx(true);
    await proposal.execute(library.getSigner());
    setProcessingTx(false);
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

              {proposal.state === 'active' && !alreadyVoted && (
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

                        {chainId && chainId !== SupportedChainId.MUMBAI && (
                          <Button
                            borderWidth="1px"
                            borderRadius="md"
                            px={4}
                            py={2}
                            _hover={{
                              borderColor,
                            }}
                          >
                            <Heading size="sm">Switch to Mumbai</Heading>
                          </Button>
                        )}

                        <PrimaryButton
                          disabled={
                            proposalLoading ||
                            votesLoading ||
                            proposal.state !== 'active' ||
                            chainId !== SupportedChainId.MUMBAI
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
                    <Text>{proposal.id}</Text>

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

                    <Text>Majority</Text>
                    <Text>
                      {zDAO?.isRelativeMajority ? 'Relative' : 'Absolute'}
                    </Text>

                    <Text>Quorum Participants</Text>
                    <Text>{zDAO?.quorumParticipants}</Text>

                    <Text>Quorum Votes</Text>
                    <Text>{zDAO?.quorumVotes}</Text>

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
                    <Text>{ProposalStateText(proposal.state)}</Text>

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

                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 2fr' }}
                  >
                    <Text>Total Votes</Text>
                    <Text>
                      {proposal.scores
                        ? new BigNumber(proposal.scores[0])
                            .plus(new BigNumber(proposal.scores[1]))
                            .toString()
                        : ''}
                    </Text>
                    <Text>Total Voters</Text>
                    <Text>{proposal.voters}</Text>
                  </SimpleGrid>
                </Stack>
              </Card>
              <Box pt={1} />

              {
                // eslint-disable-next-line no-nested-ternary
                proposal.state === 'queueing' ? (
                  <>
                    {chainId && chainId !== SupportedChainId.MUMBAI && (
                      <Button
                        borderWidth="1px"
                        borderRadius="md"
                        px={4}
                        py={2}
                        _hover={{
                          borderColor,
                        }}
                      >
                        <Heading size="sm">Switch to Mumbai</Heading>
                      </Button>
                    )}
                    <PrimaryButton
                      disabled={
                        isProcessingTx || chainId !== SupportedChainId.GOERLI
                      }
                      onClick={handleCollectProposal}
                    >
                      Collect Proposal
                    </PrimaryButton>
                  </>
                ) : proposal.state === 'collecting' ? (
                  <>
                    {chainId && chainId !== SupportedChainId.GOERLI && (
                      <Button
                        borderWidth="1px"
                        borderRadius="md"
                        px={4}
                        py={2}
                        _hover={{
                          borderColor,
                        }}
                      >
                        <Heading size="sm">Switch to Goerli</Heading>
                      </Button>
                    )}

                    {collectHashesLoading ? (
                      <Stack direction="row" spacing={4}>
                        <Loader />
                        <Text>Looking for transaction hashes collected</Text>
                      </Stack>
                    ) : (
                      collectedHashes && (
                        <SimpleGrid
                          columns={2}
                          spacing={4}
                          templateColumns={{ base: '1fr 2fr' }}
                          alignItems="center"
                        >
                          {collectedHashes.map((collected) => (
                            <>
                              <LinkExternal
                                chainId={SupportedChainId.MUMBAI}
                                type={ExternalLinkType.tx}
                                value={collected.hash}
                              />
                              <PrimaryButton
                                disabled={
                                  isProcessingTx ||
                                  !collected.isCheckPointed ||
                                  chainId !== SupportedChainId.GOERLI
                                }
                                onClick={() =>
                                  // eslint-disable-next-line prettier/prettier
                                  handleReceiveCollectProposal(collected.hash)}
                              >
                                {!collected.isCheckPointed
                                  ? 'Checkpointing'
                                  : 'Receive result'}
                              </PrimaryButton>
                            </>
                          ))}
                        </SimpleGrid>
                      )
                    )}
                  </>
                ) : (
                  proposal.state === 'succeeded' && (
                    <>
                      {chainId && chainId !== SupportedChainId.GOERLI && (
                        <Button
                          borderWidth="1px"
                          borderRadius="md"
                          px={4}
                          py={2}
                          _hover={{
                            borderColor,
                          }}
                        >
                          <Heading size="sm">Switch to Goerli</Heading>
                        </Button>
                      )}
                      <PrimaryButton
                        disabled={
                          isProcessingTx || chainId !== SupportedChainId.GOERLI
                        }
                        onClick={handleExecuteProposal}
                      >
                        Execute Proposal
                      </PrimaryButton>
                    </>
                  )
                )
              }
              <Spacer pt={2} />
            </Stack>
          </Stack>
        )}
      </VStack>
    </Container>
  );
};

export default Voting;
