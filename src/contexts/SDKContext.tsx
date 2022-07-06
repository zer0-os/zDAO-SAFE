import { Snapshot, zNA } from '@zero-tech/zdao-sdk';
import React, { useCallback, useEffect, useState } from 'react';

import { env } from '../config/env';
import { useAppDispatch } from '../states';
import { ApplicationStatus, setApplicationStatus } from '../states/application';

interface SDKContextValue {
  isInitialized: boolean;
  instance?: Snapshot.SnapshotSDKInstance;
  zNAs: string[];
  zDAOs: Snapshot.SnapshotZDAO[];
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
    Snapshot.SnapshotSDKInstance | undefined
  >(undefined);
  const [zNAs, setZNAs] = useState<zNA[]>([]);
  const [zDAOs, setZDAOs] = useState<Snapshot.SnapshotZDAO[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const createInstance = useCallback(async () => {
    console.log('creating instance');
    console.time('createInstance');

    setInitialized(false);
    const config = Snapshot.developmentConfiguration({
      ethereum: env.ethereum,
      zNA: env.zNA,
      fleek: env.fleek,
      ipfsGateway: env.ipfsGateway,
    });

    const sdk = await Snapshot.createSDKInstance(config);

    const zNAAssociates = await sdk.listZNAs();
    console.log('all the associated zNAs', zNAAssociates);
    setZNAs(zNAAssociates);

    const zDAOsList = await sdk.listZDAOs();
    console.log('zDAOs', zDAOsList);
    setZDAOs(zDAOsList);

    setInstance(sdk as Snapshot.SnapshotSDKInstance);
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
          [] as Snapshot.SnapshotZDAO[]
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
