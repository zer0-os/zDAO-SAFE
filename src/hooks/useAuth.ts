import { /* UnsupportedChainIdError, */ useWeb3React } from '@web3-react/core';
import { useCallback, useState } from 'react';

// import {
//   NoEthereumProviderError,
//   UserRejectedRequestError as UserRejectedRequestErrorInjected,
// } from '@web3-react/injected-connector';
// import {
//   UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
//   WalletConnectConnector,
// } from '@web3-react/walletconnect-connector';
import {
  connectorLocalStorageKey,
  ConnectorNames,
  CONNECTORS_BY_NAMES,
} from '../config/constants/wallet';

const useAuth = () => {
  const { chainId, activate, deactivate } = useWeb3React();
  const [error, setError] = useState<Error | undefined>(undefined);

  const logout = useCallback(() => {
    deactivate();
  }, [deactivate, chainId]);

  const login = useCallback(
    (connectorID: ConnectorNames) => {
      const connector = CONNECTORS_BY_NAMES[connectorID];
      if (connector) {
        console.log('connectorId', connectorID, connector);

        setError(undefined);
        window.localStorage.setItem(connectorLocalStorageKey, connectorID);
        activate(connector, async (error: Error) => {
          console.log('activate error', error);
          setError(error);
          window.localStorage.removeItem(connectorLocalStorageKey);

          logout();
        });
      } else {
        // Unable to find connector
      }
    },
    [activate, logout]
  );

  return { login, logout, error };
};

export default useAuth;
