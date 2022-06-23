import { ChakraProvider } from '@chakra-ui/react';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { Provider } from 'react-redux';

import { RefreshContextProvider } from './contexts/RefreshContext';
import { SDKProvider } from './contexts/SDKContext';
import store from './states/index';
import { theme } from './theme';
import { getLibrary } from './utils/web3React';

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        <RefreshContextProvider>
          <Provider store={store}>
            <SDKProvider>{children}</SDKProvider>
          </Provider>
        </RefreshContextProvider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
