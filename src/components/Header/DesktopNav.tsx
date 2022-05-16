import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Button,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { IoExitOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import { ChainText } from '../../config/constants/text';
import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import useAuth from '../../hooks/useAuth';
import { shortenAddress } from '../../utils/address';
import { ConnectWalletButton } from '../Button';

const DesktopNav = (props: BoxProps) => {
  const { account, chainId } = useActiveWeb3React();
  const { logout } = useAuth();
  const borderColor = useColorModeValue('blue.600', 'rgb(145, 85, 230)');

  return (
    <>
      {!account ? (
        <ConnectWalletButton />
      ) : (
        <>
          <Link to="/create-zdao">
            <Button
              borderWidth="1px"
              borderRadius="md"
              px={4}
              py={2}
              _hover={{
                borderColor,
              }}
            >
              <Heading size="sm">Create zDAO</Heading>
            </Button>
          </Link>

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
