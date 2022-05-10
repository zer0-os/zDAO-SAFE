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
import React from 'react';
import { IoExitOutline } from 'react-icons/io5';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useAuth from '../../hooks/useAuth';
import { shortenAddress } from '../../utils/address';
import { ConnectWalletButton, LinkButton } from '../Button';

const DesktopNav = (props: BoxProps) => {
  const { account } = useActiveWeb3React();
  const { logout } = useAuth();

  return (
    <>
      <LinkButton
        borderWidth="1px"
        borderColor="transparent"
        href="/create"
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
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
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

export default DesktopNav;
