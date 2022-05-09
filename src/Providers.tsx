import { Web3ReactProvider } from '@web3-react/core';
import React from 'react';
import { Provider } from 'react-redux';

import { RefreshContextProvider } from './contexts/RefreshContext';
import { SDKProvider } from './contexts/SDKContext';
import store from './states/index';
import { getLibrary } from './utils/web3React';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <RefreshContextProvider>
        <SDKProvider>
          <Provider store={store}>{children}</Provider>
        </SDKProvider>
      </RefreshContextProvider>
    </Web3ReactProvider>
  );
};

export default Providers;
