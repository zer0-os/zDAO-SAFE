import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { Provider } from 'react-redux';

import { RefreshContextProvider } from '@/contexts/RefreshContext';
import store from '@/states/index';
import { getLibrary } from '@/utils/web3React';

import { SDKProvider } from './contexts/SDKContext';
import { theme } from './theme';

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        <Provider store={store}>
          <RefreshContextProvider>
            <SDKProvider>{children}</SDKProvider>
          </RefreshContextProvider>
        </Provider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
