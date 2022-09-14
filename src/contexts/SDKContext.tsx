import { JsonRpcProvider } from '@ethersproject/providers';
import { Polygon, zNA } from '@zero-tech/zdao-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { env } from '../config/env';
import { useAppDispatch } from '../states';
import { ApplicationStatus, setApplicationStatus } from '../states/application';

interface SDKContextValue {
  isInitialized: boolean;
  instance?: Polygon.PolygonSDKInstance;
  zDAOs: Polygon.PolygonZDAO[];
  refreshzDAO: (zNA: zNA) => Promise<void>;
  refreshing: boolean;
}

const SDKContext = React.createContext<undefined | SDKContextValue>(undefined);

interface SDKContextProps {
  children?: React.ReactNode;
}

const SDKProvider = ({ children }: SDKContextProps) => {
  const [initialized, setInitialized] = useState<boolean>(false);
  const [instance, setInstance] = useState<
    Polygon.PolygonSDKInstance | undefined
  >(undefined);
  const [zDAOs, setZDAOs] = useState<Polygon.PolygonZDAO[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const ethereumProvider = useMemo(
    () => new JsonRpcProvider(env.ethereum.rpcUrl, env.ethereum.network),
    [],
  );

  const polygonProvider = useMemo(
    () => new JsonRpcProvider(env.polygon.rpcUrl, env.polygon.network),
    [],
  );

  const createInstance = useCallback(async () => {
    console.log('creating instance');
    console.time('createInstance');

    setInitialized(false);
    const config = Polygon.developmentConfiguration({
      ethereumProvider,
      polygonProvider,
      fleek: env.fleek,
      ipfsGateway: env.ipfsGateway,
      zNSProvider: new JsonRpcProvider(
        env.zNSProvider.rpcUrl,
        env.zNSProvider.network,
      ),
    });

    console.time('createSDKInstance');
    const sdk = await Polygon.createSDKInstance(config);
    console.timeEnd('createSDKInstance');

    const zDAOsList = await sdk.listZDAOs();
    console.log('zDAOs', zDAOsList);
    setZDAOs(zDAOsList);

    setInstance(sdk as Polygon.PolygonSDKInstance);
    setInitialized(true);

    dispatch(setApplicationStatus({ appStatus: ApplicationStatus.LIVE }));
    console.timeEnd('createInstance');
  }, [dispatch, ethereumProvider, polygonProvider]);

  const refreshzDAO = useCallback(
    async (zNA: zNA) => {
      if (!instance) return;

      setRefreshing(true);
      const zDAO = await instance.getZDAOByZNA(zNA);
      setZDAOs(
        zDAOs.reduce(
          (prev, current) => [...prev, current.id === zDAO.id ? zDAO : current],
          [] as Polygon.PolygonZDAO[],
        ),
      );
      setRefreshing(false);
    },
    [instance, zDAOs],
  );

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createInstance();
  }, [createInstance]);

  return (
    <SDKContext.Provider
      value={{
        isInitialized: initialized,
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
