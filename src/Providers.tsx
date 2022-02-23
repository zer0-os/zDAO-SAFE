import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from '@/utils/web3React';
import { theme } from './theme';

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        {children}
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
