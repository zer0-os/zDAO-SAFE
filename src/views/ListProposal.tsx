import Card from '@/components/Card';
import LinkButton from '@/components/Button/LinkButton';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useProposals from '@/hooks/useProposals';
import { shortenAddress } from '@/utils/address';
import {
  Badge,
  Container,
  Heading,
  Stack,
  Text,
  VStack,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

export interface Proposal {
  id: string;
  title: string;
  body: string;
  choices: [string];
  start: number;
  end: number;
  snapshot: string;
  state: string;
  author: string;
  space: {
    name: string;
  };
}

interface ProposalCardProps {
  proposal: Proposal;
}

const ProposalCard = ({ proposal }: ProposalCardProps) => {
  const {
    id,
    title,
    // body,
    space: { name },
    author,
    state,
    end,
  } = proposal;
  const { account } = useActiveWeb3React();
  const textColor = useColorModeValue('gray.700', 'gray.400');

  const currentTime = new Date().getTime() / 1000;
  let diff = Math.abs(end - currentTime);
  const days = Math.floor(diff / 86400);
  diff = diff % 86400;
  const hrs = Math.floor(diff / 3600);

  return (
    <LinkButton
      href={'/voting/' + id}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card title={title} _hover={{ borderColor: textColor }}>
        <VStack spacing={2}>
          <Flex width={'100%'} basis={1} justify="space-between">
            <Flex>
              <Text color={textColor}>{name} by </Text>
              <Text color={textColor} marginLeft={1}>
                {author === account ? 'You' : shortenAddress(author)}
              </Text>
            </Flex>
            {state === 'active' ? (
              <Badge borderRadius={'full'} colorScheme={'green'} px={3} py={1}>
                {state}
              </Badge>
            ) : (
              <Badge borderRadius={'full'} px={3} py={1}>
                {state}
              </Badge>
            )}
          </Flex>
          {/* <Text color={textColor} width={'100%'}>
            {shorten(body, 120)}
          </Text> */}
          <Flex width="100%" color={textColor}>
            <Text>{end > currentTime ? 'Ends in' : 'Ended'}</Text>
            {days > 0 ? <Text marginLeft={1}>{days} days</Text> : null}
            {hrs > 0 ? <Text marginLeft={1}>{hrs} hours</Text> : null}
            {end < currentTime ? <Text marginLeft={1}>ago</Text> : null}
          </Flex>
        </VStack>
      </Card>
    </LinkButton>
  );
};

const ListProposal = () => {
  const { space: spaceId } = useParams();
  const { loading, proposals } = useProposals(spaceId);

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        {loading && (
          <Stack justifyContent={'center'}>
            <Heading as={'h1'} fontSize={'xl'} fontFamily={'body'}>
              Loading ...
            </Heading>
          </Stack>
        )}
        {!loading && (
          <VStack
            spacing={12}
            flex={2}
            direction={{ base: 'column', sm: 'row' }}
            w={'full'}
          >
            {proposals.map((proposal: Proposal) => (
              <ProposalCard key={proposal.id} proposal={proposal} />
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default ListProposal;
