/* eslint-disable react/prop-types */
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
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
  Flex,
} from '@chakra-ui/react';
import Card from '@/components/Card';
import useProposals from '@/hooks/useProposals';
import { shortenAddress } from '@/utils/address';

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
    body,
    space: { name },
    author,
    state,
    end,
  } = proposal;
  const { account } = useActiveWeb3React();
  const currentTime = new Date().getTime() / 1000;
  let diff = Math.abs(end - currentTime);
  const days = Math.floor(diff / 86400);
  diff = diff % 86400;
  const hrs = Math.floor(diff / 3600);

  return (
    <Link
      href={'/voting/' + id}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card title={title}>
        <VStack spacing={2}>
          <Flex width={'100%'} basis={1} justify="space-between">
            <Flex>
              <Text color="gray.500">{name} by </Text>
              <Text color="white" marginLeft={1}>
                {author === account ? 'You' : shortenAddress(author)}
              </Text>
            </Flex>
            {state === 'active' ? (
              <Badge colorScheme={'green'}>{state}</Badge>
            ) : (
              <Badge>{state}</Badge>
            )}
          </Flex>
          <Text width={'100%'}>{body}</Text>
          <Flex width="100%">
            <Text>{end > currentTime ? 'Ends in' : 'Ended'}</Text>
            {days > 0 ? <Text marginLeft={1}>{days} days</Text> : null}
            {hrs > 0 ? <Text marginLeft={1}>{hrs} hours</Text> : null}
            {end < currentTime ? <Text marginLeft={1}>ago</Text> : null}
          </Flex>
        </VStack>
      </Card>
    </Link>
  );
};

const Landing = () => {
  const { loading, proposals } = useProposals();
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

export default Landing;
