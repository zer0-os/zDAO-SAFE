import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  BoxProps,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import ConnectWalletButton from '@/components/Button/ConnectWalletButton';
import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import useAuth from '@/hooks/useAuth';
import { shortenAddress } from '@/utils/address';
import { IoExitOutline } from 'react-icons/io5';

export const DesktopNav = (props: BoxProps) => {
  const { account } = useActiveWeb3React();
  const { logout } = useAuth();

  return (
    <>
      <Link href={'/create'} style={{ textDecoration: 'none' }}>
        <Text
          bg={'blue.400'}
          color={'white'}
          fontWeight={'bold'}
          px={5}
          py={1}
          rounded={'full'}
          _hover={{
            bg: 'blue.100',
          }}
        >
          Create
        </Text>
      </Link>
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
