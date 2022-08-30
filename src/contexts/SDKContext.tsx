import {
  createSDKInstance,
  developmentConfiguration,
  SDKInstance,
  zDAO,
  zNA,
} from '@zero-tech/zdao-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';

import { env } from '@/config/env';
import { useAppDispatch } from '../states';
import { ApplicationStatus, setApplicationStatus } from '@/states/application';

interface SDKContextValue {
  instance?: SDKInstance;
  zDAOs: zDAO[];
  refreshzDAO: (zNA: zNA) => Promise<void>;
  refreshing: boolean;
}

const SDKContext = React.createContext<undefined | SDKContextValue>(undefined);

interface SDKContextProps {
  children?: React.ReactNode;
}

const SDKProvider = ({ children }: SDKContextProps) => {
  const [instance, setInstance] = useState<SDKInstance | undefined>(undefined);
  const [zDAOs, setZDAOs] = useState<zDAO[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const provider = useMemo(
    () => new JsonRpcProvider(env.ethereum.rpcUrl, env.ethereum.network),
    []
  );

  const createInstance = useCallback(async () => {
    const config = developmentConfiguration(provider, env.ipfsGateway);

    const sdk = await createSDKInstance(config);
    setInstance(sdk);

    const zNAs = await sdk.listZNAs();
    const zDAOs = await Promise.all(zNAs.map((zNA) => sdk.getZDAOByZNA(zNA)));
    setZDAOs(zDAOs);

    dispatch(setApplicationStatus({ appStatus: ApplicationStatus.LIVE }));
  }, [provider]);

  const refreshzDAO = useCallback(
    async (zNA: zNA) => {
      if (!instance) return;

      setRefreshing(true);
      const zDAO = await instance.getZDAOByZNA(zNA);
      setZDAOs(
        zDAOs.reduce(
          (prev, current) => [...prev, current.id === zDAO.id ? zDAO : current],
          [] as zDAO[]
        )
      );
      setRefreshing(false);
    },
    [instance, zDAOs]
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createInstance();
  }, [createInstance]);

  return (
    <SDKContext.Provider
      value={{
        instance,
        zDAOs,
        refreshzDAO,
        refreshing,
      }}
    >
      {children}
    </SDKContext.Provider>
  );
};

export { SDKContext, SDKProvider };
