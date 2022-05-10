import { zDAO as zDAOType } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

import { useSdkContext } from './useSdkContext';

const useCurrentZDAO = (zNA?: string): zDAOType | undefined => {
  const [zDAO, setZDAO] = useState<zDAOType | undefined>(undefined);
  const { instance } = useSdkContext();

  useEffect(() => {
    const fetchInstance = async () => {
      if (!instance || !zNA) return undefined;
      const zDAOInstance = await instance.getZDAOByZNA(zNA);
      setZDAO(zDAOInstance);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    fetchInstance();
  }, [instance, zNA]);

  return zDAO;
};

export default useCurrentZDAO;
