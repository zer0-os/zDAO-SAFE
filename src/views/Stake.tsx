import {
  Button,
  Container,
  Heading,
  Input,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { SupportedChainId } from '@zero-tech/zdao-sdk';
import React, { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';

import { ConnectWalletButton, PrimaryButton } from '../components/Button';
import LinkExternal, {
  ExternalLinkType,
} from '../components/Button/LinkExternal';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { useSdkContext } from '../hooks/useSdkContext';
import { useBlockNumber } from '../states/application/hooks';
import { isAddress } from '../utils/address';
import { setupNetwork } from '../utils/wallet';

interface StakeFormat {
  erc20?: string | null;
  erc20Amount?: string | null;
  erc721?: string | null;
  erc721TokenId: string | null;
}

const Stake = () => {
  const { account, chainId, library } = useActiveWeb3React();
  const { instance } = useSdkContext();
  const navigate = useNavigate();
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const blockNumber = useBlockNumber();

  const [state, setState] = useState<StakeFormat>({
    erc20: '0xe6445D91C03C22DE0Deb9F887aFcf96420D869c7',
    erc20Amount: null,
    erc721: null,
    erc721TokenId: null,
  });
  const [executing, setExecuting] = useState<boolean>(false);

  const { erc20, erc20Amount, erc721, erc721TokenId } = state;

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
        await instance.staking.stakeERC20(signer, erc20!, erc20Amount!);
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
          description: `Failed to stake a Token - ${error.message}`,
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
  ]);

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to="/">
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Home</Heading>
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
            <LinkExternal
              chainId={SupportedChainId.MUMBAI}
              type={ExternalLinkType.address}
              value={instance?.staking?.address ?? ''}
            />

            <Text>Block Number</Text>
            <LinkExternal
              chainId={SupportedChainId.MUMBAI}
              type={ExternalLinkType.block}
              value={blockNumber ?? '0x0'}
            />

            <Text>Voting Token</Text>
            <Stack spacing={4} direction="row">
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
            </Stack>

            <Spacer />
            <Stack spacing={4} direction="row">
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
            </Stack>
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
