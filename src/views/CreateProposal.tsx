import { SpinnerIcon } from '@chakra-ui/icons';
import {
  Button,
  Checkbox,
  Container,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import { SupportedChainId } from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { addSeconds, format } from 'date-fns';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '../components/Button';
import ConnectWalletButton from '../components/Button/ConnectWalletButton';
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
import Card from '../components/Card';
import ReactMdEditor from '../components/ReactMdEditor';
import TransferAbi from '../config/abi/transfer.json';
import { DECIMALS } from '../config/constants/number';
import { TESTNET_TOKEN_LIST } from '../config/constants/tokens';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useBlockNumber } from '../states/application/hooks';

const Periods = {
  300: '5 Minutes',
  900: '15 Minutes',
  3600: '1 Hour',
  86400: '1 Day',
};

interface ProposalFormat {
  title: string;
  body: string;
  startDateTime: Date;
  period: number;
  majority: boolean;
  quorumParticipants: number;
  quorumVotes: string;
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

  const [state, setState] = useState<ProposalFormat>({
    title: '',
    body: '',
    startDateTime: new Date(),
    period: 86400,
    majority: true, // true if relative majority
    quorumParticipants: 0,
    quorumVotes: '0',
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
    startDateTime,
    period,
    majority,
    quorumParticipants,
    quorumVotes,
    snapshot,
    abi,
    sender,
    recipient,
    token,
    amount,
  } = state;
  const { account, chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const blockNumber = useBlockNumber();
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isValid =
    !!account &&
    chainId === SupportedChainId.GOERLI &&
    title.length > 0 &&
    body.length > 0 &&
    // token.length > 0 &&
    recipient.length > 0 &&
    Number(amount) > 0;

  useEffect(() => {
    if (blockNumber)
      setState((prevState) => ({
        ...prevState,
        snapshot: blockNumber,
      }));
  }, [blockNumber]);

  const updateValue = (
    key: string,
    value: string | number | Date | BigNumber | boolean,
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

  const handleSubmitProposal = async () => {
    // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // const tokenType = getToken(chainId!, token);
    // if (!tokenType) {
    //   return;
    // }
    // const payload = {
    //   from: account,
    //   space: SPACE_ID,
    //   timestamp: Math.floor((new Date().getTime() / 1e3).toFixed()),
    //   type: 'single-choice',
    //   title,
    //   body,
    //   choices: Choices,
    //   start: Math.floor(startDateTime.getTime() / 1e3),
    //   end: Math.floor(addSeconds(startDateTime, period).getTime() / 1e3),
    //   snapshot: blockNumber,
    //   plugins: {},
    //   metadata: {
    //     abi,
    //     sender,
    //     recipient,
    //     token,
    //     amount: new BigNumber(amount)
    //       .multipliedBy(extendToDecimals(tokenType?.decimals))
    //       .toString(),
    //   },
    // };
    // // console.log(payload);
    // const resp = await sendEIP712(space, 'proposal', payload);
    // if (resp && resp.id) {
    //   navigate(`/voting/${resp.id}`);
    // }
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
                  <Text>Period</Text>
                  <Select
                    name="period"
                    onChange={handleSelectChange}
                    value={period.toString()}
                  >
                    {Object.keys(Periods).map((key) => (
                      <option key={key} value={key}>
                        {(Periods as any)[key]}
                      </option>
                    ))}
                  </Select>
                  <Text>Start DateTime</Text>
                  <Text>{format(startDateTime, 'yyyy-MM-dd HH:mm:ss')}</Text>

                  <Text>End DateTime</Text>
                  <Text>
                    {format(
                      addSeconds(startDateTime, period),
                      'yyyy-MM-dd HH:mm:ss',
                    )}
                  </Text>

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

                  <Text>Majority</Text>
                  <Checkbox
                    isChecked={majority}
                    name="majority"
                    onChange={handleCheckboxChange}
                  >
                    Relative
                  </Checkbox>

                  <Text>Quorum Participants</Text>
                  <Input
                    borderColor={borderColor}
                    fontSize="md"
                    name="quorumParticipants"
                    onChange={handleInputChange}
                    placeholder="Quorum Participants"
                    size="md"
                    value={quorumParticipants}
                    _hover={{
                      borderRadius: 'gray.300',
                    }}
                    required
                  />

                  <Text>Quorum Votes</Text>
                  <Input
                    pattern="^[0-9]*[.,]?[0-9]$"
                    inputMode="decimal"
                    borderColor={borderColor}
                    fontSize="md"
                    name="quorumVotes"
                    onChange={handleInputChange}
                    placeholder="Quorum Votes"
                    size="md"
                    value={quorumVotes}
                    _hover={{
                      borderRadius: 'gray.300',
                    }}
                    required
                  />
                </SimpleGrid>

                {account ? (
                  <PrimaryButton
                    disabled={!isValid}
                    leftIcon={<SpinnerIcon />}
                    onClick={handleSubmitProposal}
                  >
                    Publish
                  </PrimaryButton>
                ) : (
                  <ConnectWalletButton />
                )}
              </Stack>
            </Card>
          </VStack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default CreateProposal;
