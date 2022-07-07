import { JsonRpcProvider } from '@ethersproject/providers';
import { Polygon, zNA } from '@zero-tech/zdao-sdk';
import React, { useCallback, useEffect, useState } from 'react';

import { env } from '../config/env';
import { useAppDispatch } from '../states';
import { ApplicationStatus, setApplicationStatus } from '../states/application';

interface SDKContextValue {
  isInitialized: boolean;
  instance?: Polygon.PolygonSDKInstance;
  zNAs: string[];
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
  const [zNAs, setZNAs] = useState<zNA[]>([]);
  const [zDAOs, setZDAOs] = useState<Polygon.PolygonZDAO[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const createInstance = useCallback(async () => {
    console.log('creating instance');
    console.time('createInstance');

    setInitialized(false);
    const config = Polygon.developmentConfiguration({
      ethereum: env.ethereum,
      polygon: env.polygon,
      zNA: env.zNA,
      proof: env.proof,
      fleek: env.fleek,
      ipfsGateway: env.ipfsGateway,
      zNSProvider: new JsonRpcProvider(
        env.zNSProvider.rpcUrl,
        env.zNSProvider.network,
      ),
    });

    const sdk = await Polygon.createSDKInstance(config);

    const zNAAssociates = await sdk.listZNAs();
    console.log('all the associated zNAs', zNAAssociates);
    setZNAs(zNAAssociates);

    const zDAOsList = await sdk.listZDAOs();
    console.log('zDAOs', zDAOsList);
    setZDAOs(zDAOsList);

    setInstance(sdk as Polygon.PolygonSDKInstance);
    setInitialized(true);

    dispatch(setApplicationStatus({ appStatus: ApplicationStatus.LIVE }));
    console.timeEnd('createInstance');
  }, [dispatch]);

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
        zNAs,
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
