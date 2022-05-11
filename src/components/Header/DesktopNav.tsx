import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import React from 'react';
import { IoExitOutline } from 'react-icons/io5';

import { ChainText } from '../../config/constants/text';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useAuth from '../../hooks/useAuth';
import { shortenAddress } from '../../utils/address';
import { ConnectWalletButton } from '../Button';

const DesktopNav = (props: BoxProps) => {
  const { account, chainId } = useActiveWeb3React();
  const { logout } = useAuth();

  return (
    <>
      {!account ? (
        <ConnectWalletButton />
      ) : (
        <>
          <Text>{chainId && ChainText(chainId)}</Text>
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
        </>
      )}
    </>
  );
};

export default DesktopNav;
