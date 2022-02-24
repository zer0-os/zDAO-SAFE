import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  SimpleGrid,
  Text,
  Stack,
  useDisclosure,
  useBreakpointValue,
  Flex,
} from '@chakra-ui/react';
import styled from 'styled-components';

import { SUPPORTED_WALLETS, WalletInfo } from '@/config/constants/wallet';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { UnsupportedChainIdError } from '@web3-react/core';

const IconWrapper = styled.div<{ size?: number | null }>`
  align-items: center;
  justify-content: center;
  & > img,
  span {
    height: ${({ size }) => (size ? `${size}px` : '24px')};
    width: ${({ size }) => (size ? `${size}px` : '24px')};
  }
`;

const ConnectWalletButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const modalSize = useBreakpointValue({ base: 'sm' });
  const { login, error } = useAuth();

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      onClose();
    }
  }, [error]);

  return (
    <>
      {error && error instanceof UnsupportedChainIdError && 'Unsupported Chain'}
      <Button cursor={'pointer'} size={'sm'} onClick={onOpen} ml={'30px'}>
        Connect Wallet
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>CONNECT</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text textAlign={'center'}>Connect with your favorite wallet.</Text>
            <Flex
              flex={{ base: 1 }}
              flexDirection={'column'}
              justifyContent={'center'}
            >
              {Object.keys(SUPPORTED_WALLETS).map((key) => {
                const option: WalletInfo = SUPPORTED_WALLETS[key];
                return (
                  <Stack
                    key={option.title}
                    direction={'row'}
                    alignItems={'center'}
                    paddingTop={'12px'}
                    spacing={3}
                  >
                    <IconWrapper
                      onClick={() => login(option.connectorId)}
                      size={64}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={option.icon} alt={'icon'} />
                    </IconWrapper>
                    <Flex flexDirection={'column'}>
                      <Text>{option.title}</Text>
                      <Text>{option.description}</Text>
                    </Flex>
                  </Stack>
                );
              })}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConnectWalletButton;
