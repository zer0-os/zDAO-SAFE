import {
  Box,
  Container,
  Flex,
  Heading,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import React from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { Link } from 'react-router-dom';

import DesktopNav from './DesktopNav';

export const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Flex
        as="header"
        pos="fixed"
        left="0"
        top="0"
        w="full"
        minH="60px"
        boxShadow="sm"
        zIndex="999"
        justify="center"
        css={{
          backdropFilter: 'saturate(180%) blur(5px)',
          backgroundColor: useColorModeValue(
            'rgba(255, 255, 255, 0.8)',
            'rgba(26, 32, 44, 0.8)',
          ),
        }}
      >
        <Container as={Flex} maxW="7xl" align="center" width="100%">
          <Flex
            flex={{ base: 1, md: 'auto' }}
            justify={{ base: 'start', md: 'start' }}
          >
            <Link to="/">
              <Heading as="h1" fontSize="3xl">
                zDAO
              </Heading>
            </Link>
          </Flex>

          <Stack
            direction="row"
            align="center"
            spacing={{ base: 6, md: 8 }}
            flex={{ base: 1, md: 'auto' }}
            justify="flex-end"
          >
            <DesktopNav display={{ base: 'none', md: 'flex' }} />
            <IconButton
              size="sm"
              variant="ghost"
              aria-label="Toggle Color Mode"
              onClick={toggleColorMode}
              icon={
                colorMode === 'light' ? (
                  <IoMoon size={18} />
                ) : (
                  <IoSunny size={18} />
                )
              }
            />
          </Stack>
        </Container>
      </Flex>
    </Box>
  );
};
