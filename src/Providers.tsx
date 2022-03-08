import { ChakraProvider } from '@chakra-ui/react';
import { RefreshContextProvider } from '@/contexts/RefreshContext';
import store from '@/states/index';
import { getLibrary } from '@/utils/web3React';
import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { Provider } from 'react-redux';
import { theme } from './theme';

const Providers: React.FC = ({ children }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <ChakraProvider resetCSS theme={theme}>
        <RefreshContextProvider>
          <Provider store={store}>{children}</Provider>
        </RefreshContextProvider>
      </ChakraProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
