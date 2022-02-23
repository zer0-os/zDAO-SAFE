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
  const modalSize = useBreakpointValue({ base: 'md', lg: '2xl' });
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
            <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8} pt={8}>
              {Object.keys(SUPPORTED_WALLETS).map((key) => {
                const option: WalletInfo = SUPPORTED_WALLETS[key];
                return (
                  <Stack
                    key={option.title}
                    direction={'column'}
                    spacing={3}
                    alignItems={'center'}
                    textAlign={'center'}
                  >
                    <IconWrapper
                      size={64}
                      onClick={() => login(option.connectorId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={option.icon} alt={'icon'} />
                    </IconWrapper>
                    <Text>{option.title}</Text>
                    <Text>{option.description}</Text>
                  </Stack>
                );
              })}
            </SimpleGrid>
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
