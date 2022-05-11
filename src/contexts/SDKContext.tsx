import {
  createSDKInstance,
  developmentConfiguration,
  SDKInstance,
  zDAO,
  zNA,
} from '@zero-tech/zdao-sdk';
import React, { useCallback, useEffect, useState } from 'react';

import { env, proofFrom } from '../config/env';
import useActiveWeb3React from '../hooks/useActiveWeb3React';
import { useAppDispatch } from '../states';
import { ApplicationStatus, setApplicationStatus } from '../states/application';

interface SDKContextValue {
  isInitialized: boolean;
  instance?: SDKInstance;
  zDAOs: zDAO[];
}

const SDKContext = React.createContext<undefined | SDKContextValue>(undefined);

interface SDKContextProps {
  children?: React.ReactNode;
}

const SDKProvider = ({ children }: SDKContextProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [instance, setInstance] = useState<SDKInstance | undefined>(undefined);
  const [zNAs, setZNAs] = useState<zNA[]>([]);
  const [zDAOs, setZDAOs] = useState<zDAO[]>([]);

  const { account } = useActiveWeb3React();

  const dispatch = useAppDispatch();

  const createInstance = useCallback(async () => {
    console.log('creating instance');
    console.time('createInstance');

    setInitialized(false);
    const config = developmentConfiguration({
      ethereum: {
        zDAOChef: env.ethereum.zDAOChef,
        rpcUrl: env.ethereum.rpc,
        network: env.ethereum.network,
        blockNumber: env.ethereum.blockNumber,
      },
      polygon: {
        zDAOChef: env.polygon.zDAOChef,
        rpcUrl: env.polygon.rpc,
        network: env.polygon.network,
        blockNumber: env.polygon.blockNumber,
      },
      proof: {
        from: account ?? proofFrom,
      },
      fleek: {
        apiKey: env.fleek.apiKey,
        apiSecret: env.fleek.apiSecret,
      },
    });

    const sdk = await createSDKInstance(config);

    const zNAsList = await sdk.listZNAs();
    setZNAs(zNAsList);

    console.log('zNAs', zNAsList);

    const zDAOsList = await sdk.listZDAOs();
    setZDAOs(zDAOsList);

    console.log('zDAOs', zDAOsList);

    setInstance(sdk);
    setInitialized(true);

    dispatch(setApplicationStatus({ appStatus: ApplicationStatus.LIVE }));

    console.timeEnd('createInstance');
  }, [dispatch, account]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createInstance();
  }, []);

  return (
    <SDKContext.Provider
      value={{
        isInitialized: initialized,
        instance,
        zDAOs,
      }}
    >
      {children}
    </SDKContext.Provider>
  );
};

export { SDKContext, SDKProvider };
