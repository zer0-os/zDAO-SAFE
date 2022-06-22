import {
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { MaxUint256 } from '@ethersproject/constants';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Polygon, SupportedChainId } from '@zero-tech/zdao-sdk';
import BigNumber from 'bignumber.js';
import { Contract } from 'ethers';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConnectWalletButton, PrimaryButton } from '../components/Button';
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
import { Loader } from '../components/Loader';
import ERC20Upgradeable from '../config/abi/ERC20Upgradeable.json';
import {
  extendToDecimals,
  getFullDisplayBalance,
} from '../config/constants/number';
import { env } from '../config/env';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import useCurrentZDAO from '../hooks/useCurrentZDAO';
import { useSdkContext } from '../hooks/useSdkContext';
import { useBlockNumber } from '../states/application/hooks';
import { isAddress } from '../utils/address';
import { setupNetwork } from '../utils/wallet';

interface StakeFormat {
  erc20?: string | null;
  erc20Amount?: string | null;
  erc721?: string | null;
  erc721TokenId: string | null;
  balance?: string | null;
  decimals?: number | null;
  staked?: string | null;
}

const Stake = () => {
  const { zNA } = useParams();
  const zDAO = useCurrentZDAO(zNA);
  const { instance } = useSdkContext();
  const { account, chainId, library } = useActiveWeb3React();
  const navigate = useNavigate();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const blockNumber = useBlockNumber();

  const [state, setState] = useState<StakeFormat>({
    erc20: null,
    erc20Amount: null,
    erc721: null,
    erc721TokenId: null,
    balance: null,
    decimals: null,
    staked: null,
  });
  const [executing, setExecuting] = useState<boolean>(false);

  const {
    erc20,
    erc20Amount,
    erc721,
    erc721TokenId,
    balance,
    decimals,
    staked,
  } = state;

  const isValid = useMemo(
    () => ({
      erc20: erc20 && !!isAddress(erc20),
      erc20Amount: erc20Amount && /^[0-9]+$/.test(erc20Amount),
      erc721: erc721 && !!isAddress(erc721),
      erc721TokenId: erc721TokenId && /^[0-9]+$/.test(erc721TokenId),
    }),
    [erc20, erc20Amount, erc721, erc721TokenId],
  );
  const isValidStaking =
    !!account &&
    chainId === SupportedChainId.MUMBAI &&
    ((isValid.erc20 && isValid.erc20Amount) ||
      (isValid.erc721 && isValid.erc721TokenId)) &&
    !executing;

  const updateValue = useCallback(
    (key: string, value: string | number | boolean) => {
      setState((prevState) => ({
        ...prevState,
        [key]: value,
      }));
    },
    [],
  );

  useEffect(() => {
    const fetch = async () => {
      if (!zDAO || !account || !instance) return;
      const childToken = (zDAO.options as Polygon.ZDAOOptions).polygonToken;
      updateValue('erc20', childToken.token);

      const contract = new Contract(
        childToken.token,
        ERC20Upgradeable.abi,
        new JsonRpcProvider(env.polygon.rpcUrl, env.polygon.network),
      );
      const balance = await contract.balanceOf(account);
      updateValue('balance', balance.toString());
      const decimals = await contract.decimals(); // if ERC20
      updateValue('decimals', decimals);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [account, updateValue, zDAO, instance]);

  useEffect(() => {
    const fetch = async () => {
      if (!account || !zDAO || !instance) return;
      const childToken = (zDAO.options as Polygon.ZDAOOptions).polygonToken;

      const staked = await instance.staking.stakingPower(
        account,
        childToken.token,
      );
      updateValue('staked', staked);
    };
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetch();
  }, [account, updateValue, instance, zDAO, executing]);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    if (value.length < 1) {
      updateValue(inputName, value);
    } else if (inputName === 'erc20Amount' && /^[0-9]+$/.test(value)) {
      updateValue(inputName, value);
    } else if (inputName === 'erc20' || inputName === 'erc721') {
      updateValue(inputName, value);
    }
  };

  const handleStakeToken = useCallback(async () => {
    if (!instance || !library || !account) return;

    setExecuting(true);
    try {
      const signer = library.getSigner(account);

      if (isValid.erc20) {
        const address = erc20!;
        const amount = extendToDecimals(decimals!).multipliedBy(
          new BigNumber(erc20Amount!),
        );

        const contract = new Contract(address, ERC20Upgradeable.abi, signer);
        const allowance = await contract?.allowance(
          account,
          instance.staking.address,
        );
        const allowanceBigNumber = new BigNumber(allowance.toString());
        if (allowanceBigNumber.lt(amount)) {
          const txApprove = await contract.approve(
            instance.staking.address,
            MaxUint256,
          );
          const receipt = await txApprove.wait();
          if (!receipt.status) {
            if (toast) {
              toast({
                title: 'Token staking',
                description: 'Approval failed',
                status: 'error',
                duration: 4000,
                isClosable: true,
              });
            }
            setExecuting(false);
            return;
          }
        }

        await instance.staking.stakeERC20(signer, address, amount.toString());
      } else if (isValid.erc721) {
        await instance.staking.stakeERC721(signer, erc721!, erc721TokenId!);
      } else return;

      if (toast) {
        toast({
          title: 'Token staked',
          description: "We've staked token on Polygon.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      console.error('Staking token error', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Failed to stake a Token - ${
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
    toast,
    instance,
    library,
    account,
    isValid,
    erc20,
    erc20Amount,
    erc721,
    erc721TokenId,
    decimals,
  ]);

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to={`/${zNA}`}>
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

        <Heading size="md">Stake Tokens</Heading>

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
            <Text>Staking Address</Text>
            {instance?.staking?.address ? (
              <LinkExternal
                chainId={SupportedChainId.MUMBAI}
                type={ExternalLinkType.address}
                value={instance.staking.address}
              />
            ) : (
              <Loader />
            )}

            <Text>Block Number</Text>
            <LinkExternal
              chainId={SupportedChainId.MUMBAI}
              type={ExternalLinkType.block}
              value={blockNumber ?? '0x0'}
            />

            <Text>
              {erc20 ? 'Staking Token(ERC20)' : 'Staking Token(ERC721)'}
            </Text>
            {erc20 ? (
              <Input
                fontSize="md"
                name="erc20"
                placeholder="ERC20"
                size="md"
                value={erc20 ?? ''}
                isInvalid={erc20 !== null && !isValid.erc20}
                onChange={handleInputChange}
                readOnly
                required
              />
            ) : (
              <Input
                fontSize="md"
                name="erc721"
                placeholder="ERC721"
                size="md"
                value={erc721 ?? ''}
                isInvalid={erc721 !== null && !isValid.erc721}
                onChange={handleInputChange}
                disabled
                required
              />
            )}
            <Text>Staking Amount</Text>
            {erc20 ? (
              <Input
                fontSize="md"
                name="erc20Amount"
                placeholder="Token Amount to participate voting"
                size="md"
                value={erc20Amount ?? ''}
                isInvalid={erc20Amount !== null && !isValid.erc20Amount}
                onChange={handleInputChange}
                required
              />
            ) : (
              <Input
                fontSize="md"
                name="erc721TokenId"
                placeholder="Token Id to participate voting"
                size="md"
                value={erc721TokenId ?? ''}
                isInvalid={erc721TokenId !== null && !isValid.erc721TokenId}
                onChange={handleInputChange}
                disabled
                required
              />
            )}
            <Text>Balance</Text>
            {balance && decimals ? (
              <Text>
                {getFullDisplayBalance(new BigNumber(balance), decimals)}
              </Text>
            ) : (
              <Loader />
            )}
            <Text>Staked Amount</Text>
            {instance && account && erc20 && staked ? (
              <Text>{getFullDisplayBalance(new BigNumber(staked), 0)}</Text>
            ) : (
              <Loader />
            )}
          </SimpleGrid>

          <VStack
            width={{ base: 'full', sm: '400px' }}
            spacing={4}
            justifyContent="end"
          >
            {account ? (
              <>
                {chainId && chainId !== SupportedChainId.MUMBAI && (
                  <Button
                    borderWidth="1px"
                    borderRadius="md"
                    px={4}
                    py={2}
                    width="full"
                    _hover={{
                      borderColor,
                    }}
                    onClick={() => setupNetwork(SupportedChainId.MUMBAI)}
                  >
                    <Heading size="sm">Switch to Mumbai</Heading>
                  </Button>
                )}
                <PrimaryButton
                  width="full"
                  disabled={!isValidStaking}
                  onClick={handleStakeToken}
                >
                  Stake Token
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

export default Stake;
