import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useAuth from '@/hooks/useAuth';
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
import { IoExitOutline } from 'react-icons/io5';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import { shortenAddress } from '@/utils/address';

export const DesktopNav = (props: BoxProps) => {
  const { account } = useActiveWeb3React();
  const { logout } = useAuth();

  return (
    <>
      {!account ? (
        <ConnectWalletButton />
      ) : (
        <Menu>
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
