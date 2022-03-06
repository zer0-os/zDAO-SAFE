import { SpinnerIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Heading,
  Input,
  Link,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
import TransferAbi from '@/config/abi/transfer.json';
import { SPACE_ID } from '@/config/constants/snapshot';
import Card from '@/components/Card';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useClient from '@/hooks/useClient';
import useExtendedSpace from '@/hooks/useExtendedSpace';
import { useBlockNumber } from '@/states/application/hooks';
import BigNumber from 'bignumber.js';
import { addSeconds, format, isValid, parseISO } from 'date-fns';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';
import {
  MAINNET_TOKEN_LIST,
  TESTNET_TOKEN_LIST,
  SAFE_ADDRESS,
} from '@/config/constants/gnosis-safe';
import { BIG_EITEEN } from '@/config/constants/number';
import { SupportedChainId } from '@/config/constants/chain';
import LinkButton from '@/components/Button/LinkButton';
import PrimaryButton from '@/components/Button/PrimaryButton';

const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null;
  }

  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = format(time, 'HH:mm:ss');

  return Math.floor(parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3);
};

const Choices = ['Yes', 'No'];

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
  snapshot: number;
  abi: string;
  sender: string;
  recipient: string;
  token: string;
  amount: BigNumber;
}

const CreateProposal = () => {
  const [state, setState] = useState<ProposalFormat>({
    title: '',
    body: '',
    startDateTime: new Date(),
    snapshot: 0,
    abi: JSON.stringify(TransferAbi),
    sender: SAFE_ADDRESS,
    recipient: '',
    token: '',
    amount: new BigNumber(0),
  });
  const {
    title,
    body,
    startDateTime,
    snapshot,
    abi,
    sender,
    recipient,
    token,
    amount,
  } = state;
  const { account, chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const { sendEIP712, clientLoading } = useClient();
  const blockNumber = useBlockNumber();
  const { space, spaceLoading } = useExtendedSpace(SPACE_ID);
  const [period, setPeriod] = useState(300);
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const isValid =
    !!account &&
    title.length > 0 &&
    body.length > 0 &&
    token.length > 0 &&
    recipient.length > 0 &&
    amount.gt(0);

  useEffect(() => {
    if (blockNumber)
      setState((prevState) => ({
        ...prevState,
        snapshot: blockNumber,
      }));
  }, [blockNumber]);

  const updateValue = (
    key: string,
    value: string | number | Date | BigNumber
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

  const tokenList = useMemo(() => {
    if (!chainId) return MAINNET_TOKEN_LIST;

    if (chainId === SupportedChainId.ETHEREUM) {
      return MAINNET_TOKEN_LIST;
    }

    return TESTNET_TOKEN_LIST;
  }, [chainId]);

  const handleSelectToken = (evt) => {
    updateValue('token', evt.target.value);
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleTextAreaChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleAmountChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, new BigNumber(value));
  };

  const handleSubmitProposal = async () => {
    const payload = {
      from: account,
      space: SPACE_ID,
      timestamp: parseInt((new Date().getTime() / 1e3).toFixed()),
      type: 'single-choice',
      title,
      body,
      choices: Choices,
      start: Math.floor(startDateTime.getTime() / 1e3),
      end: Math.floor(addSeconds(startDateTime, period).getTime() / 1e3),
      snapshot: blockNumber,
      plugins: {},
      metadata: {
        abi,
        sender,
        recipient,
        token,
        amount: amount.multipliedBy(BIG_EITEEN).toString(),
      },
    };
    console.log(payload);
    const resp = await sendEIP712(space, 'proposal', payload);
    if (resp && resp.id) {
      navigate(`/voting/${resp.id}`);
    }
  };

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
        <LinkButton href={'/'}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </LinkButton>

        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', md: 'row' }}
          w={'full'}
        >
          <VStack spacing={6} flex={1}>
            {/* Proposal title & content */}
            <Input
              borderColor={borderColor}
              fontSize={'md'}
              name={'title'}
              onChange={handleInputChange}
              placeholder={'Proposal title'}
              size={'lg'}
              value={title}
              _hover={{
                borderRadius: 'gray.300',
              }}
              required
            ></Input>
            <Textarea
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
            ></Textarea>

            <Card title={'Transfer tokens'}>
              <Stack spacing={2} direction={'column'}>
                <Select
                  borderColor={borderColor}
                  onChange={handleSelectToken}
                  onClick={handleSelectToken}
                  placeholder={'[ERC20 Token]'}
                >
                  {Object.keys(tokenList).map((key) => (
                    <option key={key} value={tokenList[key]}>
                      {key}
                    </option>
                  ))}
                </Select>
                <Input
                  borderColor={borderColor}
                  fontSize={'md'}
                  name={'token'}
                  onChange={handleInputChange}
                  placeholder={'ERC20 Token Address'}
                  size={'md'}
                  value={token}
                  _hover={{
                    borderRadius: 'gray.900',
                  }}
                  readOnly
                  required
                ></Input>
                <Textarea
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
                ></Textarea>
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
                  fontSize={'md'}
                  name={'recipient'}
                  onChange={handleInputChange}
                  placeholder={'Recipient Address'}
                  size={'md'}
                  value={recipient}
                  _hover={{
                    borderRadius: 'gray.900',
                  }}
                  required
                ></Input>
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 100px' }}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Input
                    borderColor={borderColor}
                    fontSize={'md'}
                    name={'amount'}
                    onChange={handleAmountChange}
                    placeholder={'Trasnfer Token Amount'}
                    size={'md'}
                    value={amount.isNaN() ? '' : amount.toString()}
                    _hover={{
                      borderRadius: 'gray.900',
                    }}
                    required
                  ></Input>
                  <Text textAlign={'center'}>Tokens</Text>
                </SimpleGrid>
              </Stack>
            </Card>
          </VStack>

          {/* Action */}
          <VStack width={{ base: 'full', sm: '400px' }}>
            <Card title={'Action'}>
              <Stack spacing={4} direction={'column'}>
                <SimpleGrid
                  columns={2}
                  templateColumns={{ base: '1fr 2fr' }}
                  alignItems={'center'}
                >
                  <Text>Period</Text>
                  <Select
                    onChange={(evt) => setPeriod(Number(evt.target.value))}
                  >
                    {Object.keys(Periods).map((key) => (
                      <option key={key} value={key}>
                        {Periods[key]}
                      </option>
                    ))}
                  </Select>
                </SimpleGrid>

                <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                  <Text>Start DateTime</Text>
                  <Text>{format(startDateTime, 'yyyy-MM-dd HH:mm:ss')}</Text>
                </SimpleGrid>
                <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                  <Text>End DateTime</Text>
                  <Text>
                    {format(
                      addSeconds(startDateTime, period),
                      'yyyy-MM-dd HH:mm:ss'
                    )}
                  </Text>
                </SimpleGrid>

                {account && (
                  <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                    <Text>Creator</Text>
                    <LinkExternal
                      type={ExternalLinkType.address}
                      value={account}
                    />
                  </SimpleGrid>
                )}
                <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                  <Text>Snapshot</Text>
                  <LinkExternal
                    type={ExternalLinkType.block}
                    value={snapshot}
                  />
                </SimpleGrid>

                {account ? (
                  <PrimaryButton
                    disabled={clientLoading || spaceLoading || !isValid}
                    leftIcon={clientLoading ? <SpinnerIcon /> : undefined}
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
