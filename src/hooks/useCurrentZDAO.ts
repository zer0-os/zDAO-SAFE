import { zDAO as zDAOType } from '@zero-tech/zdao-sdk';
import { useMemo } from 'react';

import { useSdkContext } from './useSdkContext';

const useCurrentZDAO = (zNA?: string): zDAOType | undefined | null => {
  const { zDAOs } = useSdkContext();

  return useMemo(() => {
    if (!zNA) return undefined;
    const filters = zDAOs.filter((zDAO) => zDAO.zNAs.indexOf(zNA) >= 0);
    return filters.length > 0 ? filters[0] : null;
  }, [zDAOs, zNA]);
};

export default useCurrentZDAO;
