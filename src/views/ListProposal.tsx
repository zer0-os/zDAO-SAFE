import { RepeatIcon } from '@chakra-ui/icons';
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import {
  ProposalState,
  Snapshot,
  SupportedChainId,
  zDAOState,
} from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { useCallback, useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useParams } from 'react-router-dom';

import Card from '../components/Card';
import { Loader } from '../components/Loader';
import { getFullDisplayBalance } from '../config/constants/number';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useSdkContext } from '../hooks/useSdkContext';
import { shortenAddress } from '../utils/address';
import { time2string } from '../utils/strings';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';

const ZDAOInfoCard = ({
  zDAO,
  zNA,
}: {
  zDAO?: Snapshot.SnapshotZDAO | null;
  zNA?: string;
}) => {
  const { refreshzDAO, refreshing } = useSdkContext();

  const handleRefreshPage = useCallback(async () => {
    if (!zNA) return;
    await refreshzDAO(zNA);
  }, [refreshzDAO, zNA]);

  return (
    <Card title={`${zDAO?.name ?? ''} - ${zDAO?.ens}`}>
      {!zDAO || refreshing ? (
        <Loader />
      ) : (
        <SimpleGrid
          columns={{ base: 2, sm: 4, md: 6 }}
          spacing={4}
          alignItems="center"
          templateColumns={{
            sm: '2fr 1fr 2fr 1fr',
            md: '2fr 1fr 2fr 1fr 2fr 1fr',
          }}
        >
          <Text>Created By</Text>
          <LinkExternal
            chainId={SupportedChainId.RINKEBY}
            type={ExternalLinkType.address}
            value={zDAO.createdBy}
          />
          <Text>Gnosis Safe</Text>
          <LinkExternal
            chainId={SupportedChainId.RINKEBY}
            type={ExternalLinkType.address}
            value={zDAO.gnosisSafe}
          />
          <Spacer />
          <Box justifyContent="flex-end">
            <IconButton
              variant="outline"
              aria-label="Refresh"
              fontSize="20px"
              icon={<RepeatIcon />}
              onClick={handleRefreshPage}
            />
          </Box>
          <Text>Voting Token</Text>
          <LinkExternal
            chainId={SupportedChainId.GOERLI}
            type={ExternalLinkType.address}
            value={zDAO.votingToken.token}
          />
          <Text>Minimum Token Holding</Text>
          <Text>{getFullDisplayBalance(new BigNumber(zDAO.amount))}</Text>
          <Text>Duration</Text>
          <Text>{time2string(zDAO.duration)}</Text>
          <Text>Voting Threshold</Text>
          <Text>
            {zDAO.votingThreshold && `${zDAO.votingThreshold / 100.0}%`}
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
          <Text>Voting Type</Text>
          <Text>
            {zDAO.isRelativeMajority
              ? 'Relative Majority'
              : 'Absolute Majority'}
          </Text>
          <Text>State</Text>
          <Badge
            borderRadius="full"
            colorScheme={zDAO.state === zDAOState.ACTIVE ? 'green' : undefined}
            px={3}
            py={1}
            width="fit-content"
            height="fit-content"
          >
            {zDAO.state}
          </Badge>
          <Text>Associated zNAs</Text>
          <Text>{zDAO.zNAs.join(',')}</Text>
        </SimpleGrid>
      )}
    </Card>
  );
};

interface ProposalCardProps {
  zNA: string;
  proposal: Snapshot.SnapshotProposal;
}

const ProposalCard = ({ zNA, proposal }: ProposalCardProps) => {
  const { account } = useActiveWeb3React();
  const textColor = useColorModeValue('gray.700', 'gray.400');

  const currentTime = new Date().getTime();
  let diff = proposal.end
    ? Math.abs(proposal.end.getTime() - currentTime) / 1000
    : undefined;
  const days = diff ? Math.floor(diff / 86400) : undefined;
  diff = diff ? diff % 86400 : undefined;
  const hrs = diff ? Math.floor(diff / 3600) : undefined;

  return (
    <Link
      to={`/${zNA}/${proposal.id}`}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card title={proposal.title} _hover={{ borderColor: textColor }}>
        <VStack spacing={2}>
          <Flex width={'100%'} basis={1} justify="space-between">
            <Flex>
              <Text color={textColor}>{`${proposal.createdBy} by`}</Text>
              <Text color={textColor} marginLeft={1}>
                {proposal.createdBy === account
                  ? 'You'
                  : shortenAddress(proposal.createdBy)}
              </Text>
            </Flex>
            {proposal.state === ProposalState.ACTIVE ? (
              <Badge borderRadius="full" colorScheme="green" px={3} py={1}>
                {proposal.state}
              </Badge>
            ) : (
              <Badge borderRadius="full" px={3} py={1}>
                {proposal.state}
              </Badge>
            )}
          </Flex>
          {/* <Text color={textColor} width={'100%'}>
            {shorten(body, 120)}
          </Text> */}
          <Flex width="100%" color={textColor}>
            {proposal.start && proposal.end ? (
              <>
                <Text>
                  {proposal.end.getTime() > currentTime ? 'Ends in ' : 'Ended '}
                </Text>
                {days && days > 0 ? (
                  <Text marginLeft={1}>{`${days} days `}</Text>
                ) : null}
                {hrs && hrs > 0 ? (
                  <Text marginLeft={1}>{`${hrs} hours `}</Text>
                ) : (
                  <Text marginLeft={1}>{`0 hours `}</Text>
                )}
                {proposal.end.getTime() < currentTime && (
                  <Text marginLeft={1}>ago</Text>
                )}
              </>
            ) : (
              <Text>pending</Text>
            )}
          </Flex>
        </VStack>
      </Card>
    </Link>
  );
};

const ListProposal = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);

  const [proposals, setProposals] = useState<{
    loading: boolean;
    list: Snapshot.SnapshotProposal[];
  }>({
    loading: true,
    list: [],
  });
  const borderColor = useColorModeValue('blue.600', 'rgb(145, 85, 230)');

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO) return;
      try {
        const list = await zDAO.listProposals();

        setProposals({
          loading: false,
          list: list, //.reverse(),
        });
      } catch (error) {
        console.error(error);
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [zDAO]);

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <Link to="/">
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        {proposals.loading ? (
          <Stack justifyContent="center">
            <Loader />
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={2}>
              <Link to={`/${zNA}/gnosis-safe`}>
                <Button
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    borderColor,
                  }}
                >
                  <Heading size="sm">Gnosis Safe</Heading>
                </Button>
              </Link>

              <Link to={`/${zNA}/create-proposal`}>
                <Button
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    borderColor,
                  }}
                  disabled={zDAO?.state !== zDAOState.ACTIVE}
                >
                  <Heading size="sm">Create Proposal</Heading>
                </Button>
              </Link>
            </Stack>

            <ZDAOInfoCard zDAO={zDAO} zNA={zNA} />

            <VStack
              spacing={12}
              flex={2}
              direction={{ base: 'column', sm: 'row' }}
              w={'full'}
            >
              {zNA &&
                proposals.list.map((proposal: Snapshot.SnapshotProposal) => (
                  <ProposalCard
                    key={proposal.id}
                    zNA={zNA}
                    proposal={proposal}
                  />
                ))}
            </VStack>
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ListProposal;
