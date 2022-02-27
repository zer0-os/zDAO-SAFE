import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import { getLibrary } from '@/utils/web3React';
import store from '@/states/index';
import { Provider } from 'react-redux';
import { theme } from './theme';

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        <Provider store={store}>{children}</Provider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
