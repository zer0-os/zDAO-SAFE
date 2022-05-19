import {
  Button,
  Container,
  Divider,
  Heading,
  Input,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Interface } from '@ethersproject/abi';
import { ContractFactory } from '@ethersproject/contracts';
import { SupportedChainId } from '@zero-tech/zdao-sdk';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import { ConnectWalletButton, PrimaryButton } from '../components/Button';
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
import ERC1967ProxyAbi from '../config/abi/ERC1967Proxy.json';
import ZeroTokenAbi from '../config/abi/ZeroToken.json';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { useSdkContext } from '../hooks/useSdkContext';
import { isAddress } from '../utils/address';
import { setupNetwork } from '../utils/wallet';

interface ZTokenFormat {
  name: string | null;
  symbol: string | null;
  totalSupply: string | null;
  target: string | null;
  amount: string | null;
}

const CreateZToken = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const { instance, zDAOs } = useSdkContext();
  const navigate = useNavigate();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const [state, setState] = useState<ZTokenFormat>({
    name: null,
    symbol: null,
    totalSupply: null,
    target: null,
    amount: null,
  });
  const [executing, setExecuting] = useState<boolean>(false);
  const [deployedTokenDAOId, setDeployedTokenDAOId] = useState<number>(0);
  const [deployedToken, setDeployedToken] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<string>('');

  const { name, symbol, totalSupply, target, amount } = state;

  const isValid = {
    deployedToken:
      deployedTokenDAOId >= 0 ||
      (deployedToken !== null && !!isAddress(deployedToken)),
    name: name !== null && name.length > 0,
    symbol: symbol !== null && symbol.length > 0,
    totalSupply: totalSupply !== null && /^[0-9]+$/.test(totalSupply),
    target: target !== null && !!isAddress(target),
    amount: amount !== null && /^[0-9]+$/.test(amount),
  };
  const isValidSelecting = zDAOs && isValid.deployedToken && !executing;
  const isValidCreating =
    !!account &&
    chainId === SupportedChainId.GOERLI &&
    isValid.name &&
    isValid.symbol &&
    isValid.totalSupply &&
    isValid.target &&
    isValid.amount &&
    !executing;

  const updateValue = (key: string, value: string | number | boolean) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    if (value.length < 1) {
      updateValue(inputName, value);
    } else if (
      (inputName === 'totalSupply' || inputName === 'amount') &&
      /^[0-9]+$/.test(value)
    ) {
      updateValue(inputName, value);
    } else if (
      inputName === 'target' ||
      inputName === 'name' ||
      inputName === 'symbol'
    ) {
      updateValue(inputName, value);
    }
  };

  const handleChangeToken = (value: string) => {
    setDeployedTokenDAOId(Number(value));
  };

  const handleDeployedToken = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    setDeployedToken(value);
    if (deployedTokenDAOId >= 0) {
      setDeployedTokenDAOId(-1);
    }
  };

  const handleSelectToken = useCallback(() => {
    if (!zDAOs || zDAOs.length <= deployedTokenDAOId) return;
    navigate(`/create-zdao/${zDAOs[deployedTokenDAOId].token}`);
  }, [deployedTokenDAOId, zDAOs, navigate]);

  const handleCreateZToken = useCallback(async () => {
    if (!instance || !library || !account) return;

    setExecuting(true);
    try {
      const signer = library.getSigner(account);

      setDeployStatus('Deploying new token');
      // create implementation of zToken
      const zTokenFactory = new ContractFactory(
        ZeroTokenAbi.abi,
        ZeroTokenAbi.bytecode,
        signer,
      );
      // const estimatedGas = await library.estimateGas(
      //   zTokenFactory.getDeployTransaction(),
      // );
      // const options = {
      //   gasLimit: calculateGasMargin(estimatedGas),
      // };
      const zTokenImplementation = await zTokenFactory.deploy();
      await zTokenImplementation.deployed();
      console.log('zTokenImplementation', zTokenImplementation.address);

      // create ERC1967 proxy contract
      const zTokenInterface = new Interface(ZeroTokenAbi.abi);
      const proxyData = zTokenInterface.encodeFunctionData('initialize', [
        name,
        symbol,
      ]);
      console.log('proxyData', proxyData);
      const proxyFactory = new ContractFactory(
        ERC1967ProxyAbi.abi,
        ERC1967ProxyAbi.bytecode,
        signer,
      );
      console.log('proxyFactory', proxyFactory);
      const proxyContract = await proxyFactory.deploy(
        zTokenImplementation.address,
        proxyData,
      );
      await proxyContract.deployed();
      console.log('proxyContract', proxyContract.address);

      setDeployStatus('Initializing new token');
      // initialize upgradeable contract
      await proxyContract.initialize(name, symbol);
      console.log('initialized');
      const token = proxyContract.address;
      console.log('new token address', token);

      setDeployStatus('Minting new token');
      // mint tokens
      await proxyContract.mint(target, amount);
      console.log('successfully minted');

      if (toast) {
        toast({
          title: 'Token created',
          description: "We've created new token.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      navigate(`/create-zdao/${token}`);
    } catch (error: any) {
      console.error('Token creation error', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Failed to create a Token - ${error.message}`,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      }
    }
    setExecuting(false);
  }, [
    toast,
    instance,
    library,
    account,
    name,
    symbol,
    amount,
    target,
    navigate,
  ]);

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to="/">
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        <Heading size="md">Select deployed token</Heading>
        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', md: 'row' }}
          w="full"
        >
          <Stack spacing={12} direction={{ base: 'column' }} w="full">
            <RadioGroup
              onChange={handleChangeToken}
              value={deployedTokenDAOId}
              width="full"
            >
              <TableContainer width="full">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>#</Th>
                      <Th>Token</Th>
                      <Th>zDAO</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {zDAOs &&
                      zDAOs.map((zDAO, index) => (
                        <Tr key={zDAO.id}>
                          <Td>
                            <Radio value={index} />
                          </Td>
                          <Td>
                            <LinkExternal
                              chainId={SupportedChainId.GOERLI}
                              type={ExternalLinkType.address}
                              value={zDAO.token}
                              shortenize={false}
                            />
                          </Td>
                          <Td>{zDAO.title}</Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              </TableContainer>
            </RadioGroup>

            <SimpleGrid
              columns={2}
              spacing={4}
              templateColumns={{ base: '180px 1fr' }}
              alignItems="center"
              width="full"
            >
              <Text>Token Address</Text>
              <Input
                fontSize="md"
                name="deployedToken"
                placeholder="Token Address"
                size="md"
                value={deployedToken ?? ''}
                isInvalid={!isValid.deployedToken}
                onChange={handleDeployedToken}
                required
              />
            </SimpleGrid>
          </Stack>

          <VStack
            width={{ base: 'full', sm: '400px' }}
            spacing={4}
            justifyContent="end"
          >
            {account ? (
              <PrimaryButton
                width="full"
                disabled={!isValidSelecting}
                onClick={handleSelectToken}
              >
                Select Token
              </PrimaryButton>
            ) : (
              <ConnectWalletButton width="full" size="md" />
            )}
          </VStack>
        </Stack>

        <Divider />

        <Heading size="md">Create new token</Heading>
        <Stack
          spacing={12}
          flex={2}
          direction={{ base: 'column', md: 'row' }}
          w="full"
        >
          <SimpleGrid
            columns={2}
            spacing={4}
            templateColumns={{ base: '180px 1fr' }}
            alignItems="center"
            width="full"
          >
            <Text>Token Name</Text>
            <Input
              fontSize="md"
              name="name"
              placeholder="Token Name"
              size="md"
              value={name ?? ''}
              isInvalid={name !== null && !isValid.name}
              onChange={handleInputChange}
              required
            />
            <Text>Token Ticker</Text>
            <Input
              fontSize="md"
              name="symbol"
              placeholder="Token Ticker"
              size="md"
              value={symbol ?? ''}
              isInvalid={symbol !== null && !isValid.symbol}
              onChange={handleInputChange}
              required
            />
            <Text>Total Supply</Text>
            <Input
              fontSize="md"
              name="totalSupply"
              placeholder="Total Supply"
              size="md"
              value={totalSupply ?? ''}
              isInvalid={totalSupply !== null && !isValid.totalSupply}
              onChange={handleInputChange}
              required
            />
            <Text>Mint Tokens</Text>
            <Stack spacing={4} direction="row">
              <Input
                fontSize="md"
                name="target"
                placeholder="Address to mint to"
                size="md"
                value={target ?? ''}
                isInvalid={target !== null && !isValid.target}
                onChange={handleInputChange}
                required
              />
              <Input
                fontSize="md"
                name="amount"
                placeholder="Mint Amount"
                size="md"
                value={amount ?? ''}
                isInvalid={amount !== null && !isValid.amount}
                onChange={handleInputChange}
                required
              />
            </Stack>
          </SimpleGrid>

          <VStack
            width={{ base: 'full', sm: '400px' }}
            spacing={4}
            justifyContent="end"
          >
            {account ? (
              <>
                <Text>{deployStatus}</Text>
                {chainId && chainId !== SupportedChainId.GOERLI && (
                  <Button
                    borderWidth="1px"
                    borderRadius="md"
                    px={4}
                    py={2}
                    width="full"
                    _hover={{
                      borderColor,
                    }}
                    onClick={() => setupNetwork(SupportedChainId.GOERLI)}
                  >
                    <Heading size="sm">Switch to Goerli</Heading>
                  </Button>
                )}
                <PrimaryButton
                  width="full"
                  disabled={!isValidCreating}
                  onClick={handleCreateZToken}
                >
                  Create Token
                </PrimaryButton>
              </>
            ) : (
              <ConnectWalletButton width="full" size="md" />
            )}
          </VStack>
        </Stack>
      </VStack>
    </Container>
  );
};

export default CreateZToken;
