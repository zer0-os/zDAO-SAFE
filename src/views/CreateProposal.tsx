import {
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { SupportedChainId } from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '../components/Button';
import ConnectWalletButton from '../components/Button/ConnectWalletButton';
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
import Card from '../components/Card';
import { Loader } from '../components/Loader';
import ReactMdEditor from '../components/ReactMdEditor';
import TransferAbi from '../config/abi/transfer.json';
import {
  DECIMALS,
  extendToDecimals,
  getFullDisplayBalance,
} from '../config/constants/number';
import { getToken, TESTNET_TOKEN_LIST } from '../config/constants/tokens';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useBlockNumber } from '../states/application/hooks';
import { time2string } from '../utils/strings';
import { setupNetwork } from '../utils/wallet';

interface ProposalFormat {
  title: string;
  body: string;
  choices: string[];
  startDateTime: Date;
  snapshot: number;
  abi: string;
  sender: string;
  recipient: string;
  token: string;
  amount: string | number;
}

const CreateProposal = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);
  const toast = useToast();

  const [state, setState] = useState<ProposalFormat>({
    title: '',
    body: '',
    choices: ['', ''],
    startDateTime: new Date(),
    snapshot: 0,
    abi: JSON.stringify(TransferAbi),
    sender: '',
    recipient: '',
    token: '',
    amount: 0,
  });
  const {
    title,
    body,
    choices,
    startDateTime,
    snapshot,
    abi,
    sender,
    recipient,
    token,
    amount,
  } = state;
  const { account, chainId, library } = useActiveWeb3React();
  const navigate = useNavigate();
  const blockNumber = useBlockNumber();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [executing, setExecuting] = useState<boolean>(false);

  const isValid =
    !!account &&
    chainId === SupportedChainId.GOERLI &&
    title.length > 0 &&
    body.length > 0 &&
    // token.length > 0 &&
    recipient.length > 0 &&
    Number(amount) > 0 &&
    !executing;

  useEffect(() => {
    if (blockNumber)
      setState((prevState) => ({
        ...prevState,
        snapshot: blockNumber,
      }));
  }, [blockNumber]);

  const updateValue = (
    key: string,
    value: string | number | Date | BigNumber | boolean | string[],
  ) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      updateValue('startDateTime', new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleBodyChange = (text: string) => {
    updateValue('body', text);
  };

  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleCheckboxChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, checked } = evt.currentTarget;
    updateValue(inputName, checked);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    if (inputName.startsWith('choices')) {
      const choiceIndex = Number(inputName.replace('choices', '')) - 1;
      updateValue(
        'choices',
        choices.map((choice, index) =>
          index === choiceIndex ? value : choice,
        ),
      );
      return;
    }
    updateValue(inputName, value);
  };

  // const handleTextAreaChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
  //   const { name: inputName, value } = evt.currentTarget;
  //   updateValue(inputName, value);
  // };

  const handleAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    if (evt.currentTarget.validity.valid) {
      updateValue(inputName, value.replace(/,/g, '.'));
    }
  };

  const handleSubmitProposal = useCallback(async () => {
    if (!chainId) return;
    const tokenType = getToken(chainId, token);
    if (!tokenType) {
      return;
    }
    if (!zDAO || !library || !account) return;

    setExecuting(true);
    try {
      console.log('proposal params', {
        title,
        body,
        transfer: {
          sender: zDAO.gnosisSafe,
          recipient,
          token,
          decimals: tokenType.decimals,
          symbol: tokenType.symbol,
          amount: new BigNumber(amount)
            .multipliedBy(extendToDecimals(tokenType.decimals))
            .toString(),
        },
      });

      const proposalId = await zDAO.createProposal(library, account, {
        title,
        body,
        choices: choices.filter((choice) => choice.length > 0),
        transfer: {
          sender: zDAO.gnosisSafe,
          recipient,
          token,
          decimals: tokenType.decimals,
          symbol: tokenType.symbol,
          amount: new BigNumber(amount)
            .multipliedBy(extendToDecimals(tokenType.decimals))
            .toString(),
        },
      });
      console.log('Proposal created, id', proposalId);

      if (toast) {
        toast({
          title: 'Proposal created',
          description: "We've created your proposal.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      navigate(`/${zNA}/${proposalId}`);
    } catch (error: any) {
      console.error('Proposal creation error', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Failed to create a proposal - ${
            error.data?.message ?? error.message
          }`,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setExecuting(false);
  }, [
    zNA,
    zDAO,
    account,
    library,
    chainId,
    toast,
    navigate,
    title,
    body,
    choices,
    recipient,
    token,
    amount,
  ]);

  const handleAddNewChoice = useCallback(async () => {
    if (choices.length < 32) {
      return;
    }
    const newChoices = [...choices];
    newChoices.push('');
    updateValue('choices', newChoices);
  }, [choices]);

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to={`/${zNA}`}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        {!zDAO ? (
          <Stack justifyContent="center">
            <Loader />
          </Stack>
        ) : (
          <Stack
            spacing={12}
            flex={2}
            direction={{ base: 'column', md: 'row' }}
            w="full"
          >
            <VStack spacing={6} flex={1}>
              {/* Proposal title & content */}
              <Input
                borderColor={borderColor}
                fontSize="md"
                name="title"
                onChange={handleInputChange}
                placeholder="Proposal title"
                size="lg"
                value={title}
                _hover={{
                  borderRadius: 'gray.300',
                }}
                required
              />
              {/* <Textarea
              borderColor={borderColor}
              fontSize={'md'}
              name={'body'}
              onChange={handleTextAreaChange}
              placeholder={'Proposal content'}
              height={'200px'}
              value={body}
              _hover={{
                borderRadius: 'gray.300',
              }}
            ></Textarea> */}

              <ReactMdEditor body={body} onChange={handleBodyChange} />

              <Card title="Voting Choices">
                <Flex direction="row">
                  <Stack spacing={2} direction="column" flex={1}>
                    {Array.from(
                      { length: choices.length },
                      (_, k) => k + 1,
                    ).map((value) => (
                      <Input
                        // eslint-disable-next-line react/no-array-index-key
                        key={`${value}`}
                        borderColor={borderColor}
                        fontSize="md"
                        name={`choices${value}`}
                        onChange={handleInputChange}
                        placeholder={`Choice ${value}`}
                        size="md"
                        value={choices[value - 1]}
                        _hover={{
                          borderRadius: 'gray.900',
                        }}
                      />
                    ))}
                  </Stack>
                  <Stack direction="row" marginLeft={2} alignItems="flex-end">
                    <PrimaryButton onClick={handleAddNewChoice}>
                      +
                    </PrimaryButton>
                  </Stack>
                </Flex>
              </Card>

              <Card title="Transfer tokens">
                <Stack spacing={2} direction="column">
                  <Select
                    borderColor={borderColor}
                    name="token"
                    onChange={handleSelectChange}
                    defaultValue={token}
                  >
                    {Object.keys(TESTNET_TOKEN_LIST).map((key) => (
                      <option key={key} value={TESTNET_TOKEN_LIST[key].address}>
                        {key}
                      </option>
                    ))}
                  </Select>
                  <Input
                    borderColor={borderColor}
                    fontSize="md"
                    name="token"
                    onChange={handleInputChange}
                    placeholder="ERC20 Token Address"
                    size="md"
                    value={token}
                    _hover={{
                      borderRadius: 'gray.900',
                    }}
                    readOnly
                    required
                  />
                  {/* <Textarea
                  borderColor={borderColor}
                  fontSize={'md'}
                  name={'abi'}
                  height={'200px'}
                  onChange={handleTextAreaChange}
                  placeholder={'Contract ABI'}
                  size={'md'}
                  readOnly
                  value={abi}
                  _hover={{
                    borderRadius: 'gray.900',
                  }}
                ></Textarea> */}
                  {/* <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'sender'}
                  onChange={handleInputChange}
                  placeholder={'Sender Address'}
                  size={'lg'}
                  value={sender}
                  isDisabled={true}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input> */}
                  <Input
                    borderColor={borderColor}
                    fontSize="md"
                    name="recipient"
                    onChange={handleInputChange}
                    placeholder="Recipient Address"
                    size="md"
                    value={recipient}
                    _hover={{
                      borderRadius: 'gray.900',
                    }}
                    required
                  />
                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 100px' }}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Input
                      borderColor={borderColor}
                      fontSize="md"
                      name="amount"
                      inputMode="decimal"
                      min={0}
                      pattern={`^[0-9]*[.,]?[0-9]{0,${DECIMALS}}$`}
                      placeholder="Trasnfer Token Amount"
                      size="md"
                      value={amount}
                      onChange={handleAmountChange}
                      _hover={{
                        borderRadius: 'gray.900',
                      }}
                      required
                    />
                    <Text textAlign="center">Tokens</Text>
                  </SimpleGrid>
                </Stack>
              </Card>
            </VStack>

            {/* Action */}
            <VStack width={{ base: 'full', sm: '400px' }}>
              <Card title="Action">
                <Stack spacing={4} direction="column">
                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 2fr' }}
                    alignItems="center"
                  >
                    <Text>Duration</Text>
                    <Text>{time2string(zDAO.votingDuration)}</Text>

                    {account && (
                      <>
                        <Text>Creator</Text>
                        <LinkExternal
                          chainId={SupportedChainId.GOERLI}
                          type={ExternalLinkType.address}
                          value={account}
                        />
                      </>
                    )}

                    <Text>Voting Token</Text>
                    <LinkExternal
                      chainId={SupportedChainId.GOERLI}
                      type={ExternalLinkType.address}
                      value={zDAO.votingToken.token}
                    />

                    <Text>Minimum Token Holding</Text>
                    <Text>
                      {getFullDisplayBalance(
                        new BigNumber(zDAO.minimumVotingTokenAmount),
                      )}
                    </Text>

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
                        zDAO.votingToken.decimals,
                      )}
                    </Text>
                  </SimpleGrid>

                  {account ? (
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
                          onClick={() => setupNetwork(SupportedChainId.GOERLI)}
                        >
                          <Heading size="sm">Switch to Goerli</Heading>
                        </Button>
                      )}
                      <PrimaryButton
                        disabled={!isValid}
                        onClick={handleSubmitProposal}
                      >
                        Publish
                      </PrimaryButton>
                    </>
                  ) : (
                    <ConnectWalletButton />
                  )}
                </Stack>
              </Card>
            </VStack>
          </Stack>
        )}
      </VStack>
    </Container>
  );
};

export default CreateProposal;
