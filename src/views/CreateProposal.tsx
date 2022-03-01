import { SpinnerIcon } from '@chakra-ui/icons';
import {
  Button,
  Container,
  Heading,
  Input,
  Link,
  SimpleGrid,
  Stack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import TransferAbi from '@/config/abi/transfer.json';
import { SPACE_ID } from '@/config/constants/space';
import Card from '@/components/Card';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import { DatePicker, TimePicker } from '@/components/DatePicker';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useClient from '@/hooks/useClient';
import useExtendedSpace from '@/hooks/useExtendedSpace';
import { useBlockNumber } from '@/states/application/hooks';
import { shortenAddress } from '@/utils/address';
import BigNumber from 'bignumber.js';
import { format, isValid, parseISO } from 'date-fns';
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBack } from 'react-icons/io5';
import LinkExternal from './components/LinkExternal';

const combineDateAndTime = (date: Date, time: Date) => {
  if (!isValid(date) || !isValid(time)) {
    return null;
  }

  const dateStr = format(date, 'yyyy-MM-dd');
  const timeStr = format(time, 'HH:mm:ss');

  return Math.floor(parseISO(`${dateStr}T${timeStr}`).getTime() / 1e3);
};

const Choices = ['Yes', 'No'];

interface ProposalFormat {
  title: string;
  body: string;
  startDate: Date;
  startTime: Date;
  endDate: Date;
  endTime: Date;
  snapshot: number;
  contract: string;
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
    startDate: new Date(),
    startTime: new Date(),
    endDate: new Date(),
    endTime: new Date(),
    snapshot: 0,
    contract: '',
    abi: JSON.stringify(TransferAbi),
    sender: '',
    recipient: '',
    token: '',
    amount: new BigNumber(0),
  });
  const {
    title,
    body,
    startDate,
    startTime,
    endDate,
    endTime,
    snapshot,
    contract,
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

  const handleDateChange = (key: string) => (value: Date) => {
    updateValue(key, value);
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
      start: combineDateAndTime(startDate, startTime),
      end: combineDateAndTime(endDate, endTime),
      snapshot: blockNumber,
      plugins: {},
      metadata: {
        contract,
        abi,
        sender,
        recipient,
        token,
        amount: amount.toString(),
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
        <Link href={'/'}>
          <Stack align={'center'} direction={'row'}>
            <IoArrowBack size={15} />
            <Heading size={'sm'}>Back</Heading>
          </Stack>
        </Link>

        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', sm: 'row' }}
          w={'full'}
        >
          <VStack spacing={6} flex={1}>
            {/* Proposal title & content */}
            <Input
              borderColor={'gray.300'}
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
              borderColor={'gray.300'}
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
                <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'contract'}
                  onChange={handleInputChange}
                  placeholder={'Target Contract Address'}
                  size={'lg'}
                  value={contract}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input>
                <Textarea
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'abi'}
                  height={'200px'}
                  onChange={handleTextAreaChange}
                  placeholder={'Contract ABI'}
                  readOnly
                  value={abi}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                ></Textarea>
                <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'sender'}
                  onChange={handleInputChange}
                  placeholder={'Sender Address'}
                  size={'lg'}
                  value={sender}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input>
                <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'recipient'}
                  onChange={handleInputChange}
                  placeholder={'Recipient Address'}
                  size={'lg'}
                  value={recipient}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input>
                <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'token'}
                  onChange={handleInputChange}
                  placeholder={'ERC20 Token Address'}
                  size={'lg'}
                  value={token}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input>
                <Input
                  borderColor={'gray.300'}
                  fontSize={'md'}
                  name={'amount'}
                  onChange={handleAmountChange}
                  placeholder={'Trasnfer Token Amount'}
                  size={'lg'}
                  value={amount.toString()}
                  _hover={{
                    borderRadius: 'gray.300',
                  }}
                  required
                ></Input>
              </Stack>
            </Card>

            {/* Choices */}
            <Card title={'Choices'}>
              <Stack spacing={2} direction={'column'}>
                {Choices.map((choice) => (
                  <Button
                    key={choice}
                    bg={'transparent'}
                    borderWidth={'1px'}
                    rounded={'full'}
                    _focus={{
                      borderColor: 'gray.600',
                    }}
                    _hover={{
                      bg: 'gray.100',
                    }}
                  >
                    {choice}
                  </Button>
                ))}
              </Stack>
            </Card>
          </VStack>

          {/* Action */}
          <VStack width={{ base: 'full', sm: '400px' }}>
            <Card title={'Action'}>
              <Stack spacing={2} direction={'column'}>
                <Text>Start Date</Text>
                <DatePicker
                  name={'startDate'}
                  onChange={handleDateChange('startDate')}
                  selected={startDate}
                  placeholderText="YYYY/MM/DD"
                />
                <Text>Start Time</Text>
                <TimePicker
                  name={'startTime'}
                  onChange={handleDateChange('startTime')}
                  selected={startTime}
                  placeholderText="00:00"
                />
                <Text>End Date</Text>
                <DatePicker
                  name={'endDate'}
                  onChange={handleDateChange('endDate')}
                  selected={endDate}
                  placeholderText="YYYY/MM/DD"
                />
                <Text>End Time</Text>
                <TimePicker
                  name={'endTime'}
                  onChange={handleDateChange('endTime')}
                  selected={endTime}
                  placeholderText="00:00"
                />
                {account && (
                  <SimpleGrid
                    columns={2}
                    spacing={4}
                    templateColumns={{ base: '1fr 2fr' }}
                  >
                    <Text>Creator</Text>
                    <LinkExternal
                      type={'account'}
                      value={shortenAddress(account)}
                    />
                  </SimpleGrid>
                )}
                <SimpleGrid
                  columns={2}
                  spacing={4}
                  templateColumns={{ base: '1fr 2fr' }}
                >
                  <Text>Snapshot</Text>
                  <LinkExternal type={'block'} value={snapshot} />
                </SimpleGrid>
                {account ? (
                  <Button
                    color={'white'}
                    bg={'blue.400'}
                    borderWidth={'1px'}
                    disabled={clientLoading || spaceLoading}
                    rounded={'full'}
                    _hover={{
                      bg: 'blue.100',
                    }}
                    onClick={handleSubmitProposal}
                    leftIcon={clientLoading ? <SpinnerIcon /> : undefined}
                  >
                    Publish
                  </Button>
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
