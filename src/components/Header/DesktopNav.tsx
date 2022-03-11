import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { ConnectWalletButton, LinkButton } from '@/components/Button';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useAuth from '@/hooks/useAuth';
import { shortenAddress } from '@/utils/address';
import { IoExitOutline } from 'react-icons/io5';

export const DesktopNav = (props: BoxProps) => {
  const { account } = useActiveWeb3React();
  const { logout } = useAuth();

  return (
    <>
      <LinkButton
        borderWidth={'1px'}
        borderColor={'transparent'}
        href={'/gnosis-safe'}
        px={4}
        py={1}
        _hover={{
          borderColor: useColorModeValue('blue.600', 'rgb(145, 85, 230)'),
          borderWidth: '1px',
          borderRadius: 'md',
        }}
      >
        Gnosis Safe
      </LinkButton>

      <LinkButton
        borderWidth={'1px'}
        borderColor={'transparent'}
        href={'/create'}
        px={4}
        py={1}
        _hover={{
          borderColor: useColorModeValue('blue.600', 'rgb(145, 85, 230)'),
          borderWidth: '1px',
          borderRadius: 'md',
        }}
      >
        Create
      </LinkButton>

      {!account ? (
        <ConnectWalletButton />
      ) : (
        <Menu {...props}>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size={'sm'}>
            <Text>{shortenAddress(account)}</Text>
          </MenuButton>
          <MenuList>
            <MenuItem icon={<IoExitOutline />} onClick={logout}>
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};
