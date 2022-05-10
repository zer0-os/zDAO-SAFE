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
import { Proposal } from '@zero-tech/zdao-sdk';
import React, { useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import Card from '../components/Card';
import { Loader } from '../components/Loader';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { shortenAddress } from '../utils/address';

const ProposalCard = ({
  zNA,
  proposal,
}: {
  zNA: string;
  proposal: Proposal;
}) => {
  const { account } = useActiveWeb3React();
  const textColor = useColorModeValue('gray.700', 'gray.400');

  // const currentTime = new Date().getTime() / 1000;
  // let diff = Math.abs(proposal.end - currentTime);
  // const days = Math.floor(diff / 86400);
  // diff = diff % 86400;
  // const hrs = Math.floor(diff / 3600);

  return (
    <Link
      to={`/${zNA}/${proposal.id}`}
      style={{ width: '100%', textDecoration: 'none' }}
    >
      <Card title={proposal.title} _hover={{ borderColor: textColor }}>
        <VStack spacing={2}>
          <Flex width="100%" basis={1} justify="space-between">
            <Flex>
              <Text color={textColor}>{`${proposal.createdBy} by`}</Text>
              <Text color={textColor} marginLeft={1}>
                {proposal.createdBy === account
                  ? 'You'
                  : shortenAddress(proposal.createdBy)}
              </Text>
            </Flex>
            {proposal.state === 'active' ? (
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
            {/* <Text>{end > currentTime ? 'Ends in' : 'Ended'}</Text>
            {days > 0 ? <Text marginLeft={1}>{days} days</Text> : null}
            {hrs > 0 ? <Text marginLeft={1}>{hrs} hours</Text> : null}
            {end < currentTime ? <Text marginLeft={1}>ago</Text> : null} */}
          </Flex>
        </VStack>
      </Card>
    </Link>
  );
};

const ListProposal = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);
  const navigate = useNavigate();

  const [proposals, setProposals] = useState<{
    loading: boolean;
    list: Proposal[];
  }>({
    loading: true,
    list: [],
  });
  const borderColor = useColorModeValue('blue.600', 'rgb(145, 85, 230)');

  console.log('listProposal, zDAO', zDAO);

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
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
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

            {proposals.list.map((proposal) => (
              <ProposalCard key={proposal.id} zNA={zNA} proposal={proposal} />
            ))}
          </>
        )}
      </VStack>
    </Container>
  );
};

export default ListProposal;
