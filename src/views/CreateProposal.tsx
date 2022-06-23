import { SpinnerIcon } from '@chakra-ui/icons';
import {
  Container,
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
import { addSeconds, format } from 'date-fns';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { PrimaryButton } from '../components/Button';
import ConnectWalletButton from '../components/Button/ConnectWalletButton';
import Card from '../components/Card';
import { Loader } from '../components/Loader';
import ReactMdEditor from '../components/ReactMdEditor';
import TransferAbi from '../config/abi/transfer.json';
import { DECIMALS, extendToDecimals } from '../config/constants/number';
import { getToken, TESTNET_TOKEN_LIST } from '../config/constants/tokens';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useBlockNumber } from '../states/application/hooks';
import { time2string } from '../utils/strings';
import LinkExternal, { ExternalLinkType } from './components/LinkExternal';

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
  amount: string | number;
}

const CreateProposal = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);
  const toast = useToast();

  const [state, setState] = useState<ProposalFormat>({
    title: '',
    body: '',
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
    startDateTime,
    snapshot,
    abi,
    sender,
    recipient,
    token,
    amount,
  } = state;
  const { library, account, chainId } = useActiveWeb3React();
  const navigate = useNavigate();
  const blockNumber = useBlockNumber();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const [executing, setExecuting] = useState<boolean>(false);
  const [period, setPeriod] = useState(86400);

  const isValid =
    !!account &&
    chainId === SupportedChainId.RINKEBY &&
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

  const handleBodyChange = (text: string) => {
    updateValue('body', text);
  };

  const handleSelectToken = (evt) => {
    updateValue('token', evt.target.value);
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
          abi,
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
        transfer: {
          abi,
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
  }, [zNA, zDAO, library, chainId, account]);

  return (
    <Container as={Stack} maxW={'7xl'}>
      <VStack spacing={{ base: 6, sm: 12 }} alignItems={'flex-start'}>
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

              <Card title={'Transfer tokens'}>
                <Stack spacing={2} direction={'column'}>
                  <Select
                    borderColor={borderColor}
                    onChange={handleSelectToken}
                    onClick={handleSelectToken}
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
                      inputMode={'decimal'}
                      min={0}
                      pattern={`^[0-9]*[.,]?[0-9]{0,${DECIMALS}}$`}
                      placeholder={'Trasnfer Token Amount'}
                      size={'md'}
                      value={amount}
                      onChange={handleAmountChange}
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
                    <Text>Duration</Text>
                    {zDAO.duration ? (
                      <Text>{time2string(zDAO.duration)}</Text>
                    ) : (
                      <Select
                        onChange={(evt) => setPeriod(Number(evt.target.value))}
                        value={period.toString()}
                      >
                        {Object.keys(Periods).map((key) => (
                          <option key={key} value={key}>
                            {Periods[key]}
                          </option>
                        ))}
                      </Select>
                    )}
                  </SimpleGrid>

                  {account && (
                    <SimpleGrid
                      columns={2}
                      templateColumns={{ base: '1fr 2fr' }}
                    >
                      <Text>Creator</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.address}
                        value={account}
                      />
                    </SimpleGrid>
                  )}

                  <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                    <Text>Voting Token</Text>
                    <LinkExternal
                      chainId={SupportedChainId.RINKEBY}
                      type={ExternalLinkType.address}
                      value={zDAO.votingToken.token}
                    />
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
                    <SimpleGrid
                      columns={2}
                      templateColumns={{ base: '1fr 2fr' }}
                    >
                      <Text>Creator</Text>
                      <LinkExternal
                        chainId={SupportedChainId.RINKEBY}
                        type={ExternalLinkType.address}
                        value={account}
                      />
                    </SimpleGrid>
                  )}
                  <SimpleGrid columns={2} templateColumns={{ base: '1fr 2fr' }}>
                    <Text>Snapshot</Text>
                    <LinkExternal
                      chainId={SupportedChainId.RINKEBY}
                      type={ExternalLinkType.block}
                      value={snapshot}
                    />
                  </SimpleGrid>

                  {account ? (
                    <PrimaryButton
                      disabled={!isValid}
                      leftIcon={executing ? <SpinnerIcon /> : undefined}
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
        )}
      </VStack>
    </Container>
  );
};

export default CreateProposal;
