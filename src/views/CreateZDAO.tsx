import {
  Button,
  Container,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Select,
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderMark,
  SliderThumb,
  SliderTrack,
  Spacer,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { SupportedChainId } from '@zero-tech/zdao-sdk';
import React, { ChangeEvent, useCallback, useState } from 'react';
import { IoArrowBack } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ConnectWalletButton, PrimaryButton } from '../components/Button';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { useSdkContext } from '../hooks/useSdkContext';
import { isAddress } from '../utils/address';
import { setupNetwork } from '../utils/wallet';

const Durations = {
  300: '5 Minutes',
  900: '15 Minutes',
  3600: '1 Hour',
  86400: '1 Day',
};

interface ZDAOFormat {
  title: string | null;
  zNA: string | null;
  gnosisSafe: string | null;
  erc20?: string | null;
  erc20Amount?: string | null;
  erc721?: string | null;
  duration: number;
  isRelativeMajority: boolean;
  votingThreshold: number;
  minimumVotingParticipants: number | null;
  minimumTotalVotingTokens: string | null;
}

const CreateZDAO = () => {
  const { token } = useParams();
  const { account, chainId, library } = useActiveWeb3React();
  const { instance } = useSdkContext();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const toast = useToast();
  const [state, setState] = useState<ZDAOFormat>({
    title: null,
    zNA: null,
    gnosisSafe: null,
    erc20: token,
    erc20Amount: null,
    erc721: null,
    duration: 300,
    isRelativeMajority: true,
    votingThreshold: 50.01,
    minimumVotingParticipants: 1,
    minimumTotalVotingTokens: null,
  });
  const [executing, setExecuting] = useState<boolean>(false);

  const {
    title,
    zNA,
    gnosisSafe,
    erc20,
    erc20Amount,
    erc721,
    duration,
    isRelativeMajority,
    votingThreshold,
    minimumVotingParticipants,
    minimumTotalVotingTokens,
  } = state;

  const isValid = {
    title: title !== null && title.length > 0,
    zNA: zNA !== null && zNA.length > 0,
    gnosisSafe: gnosisSafe != null && !!isAddress(gnosisSafe),
    erc20: erc20 && !!isAddress(erc20),
    erc20Amount: erc20Amount && /^[0-9]+$/.test(erc20Amount),
    erc721: erc721 && !!isAddress(erc721),
    minimumVotingParticipants:
      minimumVotingParticipants !== null && minimumVotingParticipants > 0,
    minimumTotalVotingTokens:
      minimumTotalVotingTokens != null &&
      /^[0-9]+$/.test(minimumTotalVotingTokens),
  };
  const isValidCreating =
    !!account &&
    chainId === SupportedChainId.GOERLI &&
    isValid.title &&
    isValid.zNA &&
    ((isValid.erc20 && isValid.erc20Amount) || isValid.erc721) &&
    isValid.minimumVotingParticipants &&
    isValid.minimumTotalVotingTokens &&
    !executing;

  const updateValue = (key: string, value: string | number | boolean) => {
    setState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleSelectChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { name: inputName, value } = evt.currentTarget;
    updateValue(inputName, value);
  };

  const handleChangeRelative = (value: string | number) => {
    updateValue('isRelativeMajority', !!Number(value));
  };

  const handleCreateZDAO = useCallback(async () => {
    if (!instance || !library || !account) return;
    if (
      !zNA ||
      !title ||
      !gnosisSafe ||
      !minimumTotalVotingTokens ||
      !minimumVotingParticipants
    )
      return;

    setExecuting(true);
    try {
      const signer = library.getSigner(account).connectUnchecked();
      await instance.createZDAO(signer, {
        zNA,
        title,
        gnosisSafe,
        token: erc20 || (erc721 ?? ''),
        amount: erc20Amount || '1',
        duration,
        votingThreshold: Math.floor(votingThreshold * 100),
        isRelativeMajority,
        minimumVotingParticipants,
        minimumTotalVotingTokens,
      });

      if (toast) {
        toast({
          title: 'zDAO created',
          description: "We've created your zDAO.",
          status: 'success',
          duration: 4000,
          isClosable: true,
        });
      }

      navigate(`/${zNA}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('zDAO creation error', error);
      if (toast) {
        toast({
          title: 'Error',
          description: `Failed to create a zDAO - ${error.message}`,
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
    navigate,
    zNA,
    title,
    gnosisSafe,
    erc20,
    erc721,
    erc20Amount,
    duration,
    votingThreshold,
    isRelativeMajority,
    minimumVotingParticipants,
    minimumTotalVotingTokens,
  ]);

  return (
    <Container as={Stack} maxW="7xl">
      <VStack spacing={{ base: 6, sm: 12 }} alignItems="flex-start">
        <Link to="/create-token">
          <Stack align="center" direction="row">
            <IoArrowBack size={15} />
            <Heading size="sm">Back</Heading>
          </Stack>
        </Link>

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
            <Text>zDAO Name</Text>
            <Input
              fontSize="md"
              name="title"
              placeholder="zDAO Name"
              size="md"
              value={title ?? ''}
              isInvalid={title !== null && !isValid.title}
              onChange={handleInputChange}
              required
            />
            <Text>zNA</Text>
            {/* <Select name="zNA" onChange={handleSelectChange} value={zNA}>
              {zNAsEmpty &&
                Object.keys(zNAsEmpty).map((key) => (
                  <option key={key} value={key}>
                    {(zNAsEmpty as any)[key]}
                  </option>
                ))}
            </Select> */}
            <Input
              fontSize="md"
              name="zNA"
              placeholder="0://"
              size="md"
              value={zNA ?? ''}
              isInvalid={zNA !== null && !isValid.zNA}
              onChange={handleInputChange}
              required
            />

            <Text>Gnosis Safe</Text>
            <Input
              fontSize="md"
              name="gnosisSafe"
              placeholder="Gnosis Safe"
              size="md"
              value={gnosisSafe ?? ''}
              isInvalid={gnosisSafe !== null && !isValid.gnosisSafe}
              onChange={handleInputChange}
              required
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
                placeholder="Minimum Token Amount to create proposal"
                size="md"
                value={erc20Amount ?? ''}
                isInvalid={erc20Amount !== null && !isValid.erc20Amount}
                onChange={handleInputChange}
                required
              />
            </Stack>

            <Spacer />
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

            <Text>Voting Duration</Text>
            <Select
              name="duration"
              onChange={handleSelectChange}
              value={duration.toString()}
            >
              {Object.keys(Durations).map((key) => (
                <option key={key} value={key}>
                  {(Durations as any)[key]}
                </option>
              ))}
            </Select>

            <Text>Voting Type</Text>
            <RadioGroup
              onChange={handleChangeRelative}
              value={Number(isRelativeMajority)}
            >
              <Stack direction="row">
                <Radio value={1}>Relative Majority</Radio>
                <Radio value={0}>Absolute Majority</Radio>
              </Stack>
            </RadioGroup>

            <Text>Voting Threshold</Text>
            <Slider
              id="slider"
              defaultValue={votingThreshold}
              min={0}
              max={100}
              step={0.01}
              onChange={(v) => updateValue('votingThreshold', v)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <SliderMark value={25} mt="1" ml="-2.5" fontSize="sm">
                25%
              </SliderMark>
              <SliderMark value={50} mt="1" ml="-2.5" fontSize="sm">
                50%
              </SliderMark>
              <SliderMark value={75} mt="1" ml="-2.5" fontSize="sm">
                75%
              </SliderMark>
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <Tooltip
                hasArrow
                bg="teal.500"
                color="white"
                placement="top"
                isOpen={showTooltip}
                label={`${votingThreshold}%`}
              >
                <SliderThumb />
              </Tooltip>
            </Slider>

            <Text>Quorum Participants</Text>
            <Input
              borderColor={borderColor}
              fontSize="md"
              name="minimumVotingParticipants"
              isInvalid={
                minimumVotingParticipants !== null &&
                !isValid.minimumVotingParticipants
              }
              onChange={handleInputChange}
              placeholder="Quorum Participants"
              size="md"
              value={minimumVotingParticipants ?? ''}
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
              name="minimumTotalVotingTokens"
              isInvalid={
                minimumTotalVotingTokens !== null &&
                !isValid.minimumTotalVotingTokens
              }
              onChange={handleInputChange}
              placeholder="Quorum Votes"
              size="md"
              value={minimumTotalVotingTokens ?? ''}
              _hover={{
                borderRadius: 'gray.300',
              }}
              required
            />
          </SimpleGrid>

          <VStack
            width={{ base: 'full', sm: '400px' }}
            spacing={4}
            justifyContent="end"
          >
            {account ? (
              <>
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
                  onClick={handleCreateZDAO}
                >
                  Publish
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

export default CreateZDAO;
