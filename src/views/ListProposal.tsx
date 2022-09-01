import {
  Badge,
  Button,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { Proposal, ProposalState } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import LinkButton from '@/components/Button/LinkButton';
import Card from '@/components/Card';
import { Loader } from '@/components/Loader';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useCurrentZDAO from '@/hooks/useCurrentZDAO';
import { shortenAddress } from '@/utils/address';

interface ProposalCardProps {
  zNA: string;
  proposal: Proposal;
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
    <LinkButton
      to={`/${zNA}/${proposal.id}`}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card title={proposal.title} _hover={{ borderColor: textColor }}>
        <VStack spacing={2}>
          <Flex width={'100%'} basis={1} justify="space-between">
            <Flex>
              <Text color={textColor}>{name} by </Text>
              <Text color={textColor} marginLeft={1}>
                {proposal.author === account
                  ? 'You'
                  : shortenAddress(proposal.author)}
              </Text>
            </Flex>
            {proposal.state === ProposalState.ACTIVE ? (
              <Badge borderRadius={'full'} colorScheme={'green'} px={3} py={1}>
                {proposal.state}
              </Badge>
            ) : (
              <Badge borderRadius={'full'} px={3} py={1}>
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
    </LinkButton>
  );
};

const ListProposal = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);

  const [proposals, setProposals] = useState<{
    loading: boolean;
    list: Proposal[];
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
          list,
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
        <LinkButton to={'/'}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </LinkButton>

        {proposals.loading ? (
          <Stack justifyContent="center">
            <Loader />
          </Stack>
        ) : (
          <>
            <Stack direction="row" spacing={2}>
              <LinkButton to={`/${zNA}/gnosis-safe`}>
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
              </LinkButton>

              <LinkButton to={`/${zNA}/create-proposal`}>
                <Button
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    borderColor,
                  }}
                >
                  <Heading size="sm">Create Proposal</Heading>
                </Button>
              </LinkButton>

              <LinkButton to={`/${zNA}/stake`}>
                <Button
                  borderWidth="1px"
                  borderRadius="md"
                  px={4}
                  py={2}
                  _hover={{
                    borderColor,
                  }}
                >
                  <Heading size="sm">Stake tokens</Heading>
                </Button>
              </LinkButton>
            </Stack>

            {zNA &&
              proposals.list.map((proposal) => (
                <ProposalCard key={proposal.id} zNA={zNA} proposal={proposal} />
              ))}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ListProposal;
