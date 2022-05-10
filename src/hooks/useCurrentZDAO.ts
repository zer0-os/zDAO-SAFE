import { zDAO as zDAOType } from '@zero-tech/zdao-sdk';
import { useMemo } from 'react';

import { useSdkContext } from './useSdkContext';

// const useCurrentZDAO = (zNA?: string): zDAOType | undefined => {
//   const [zDAO, setZDAO] = useState<zDAOType | undefined>(undefined);
//   const { instance } = useSdkContext();

//   useEffect(() => {
//     const fetchInstance = async () => {
//       if (!instance || !zNA) return undefined;
//       const zDAOInstance = await instance.getZDAOByZNA(zNA);
//       setZDAO(zDAOInstance);
//     };

//     // eslint-disable-next-line @typescript-eslint/no-floating-promises
//     fetchInstance();
//   }, [instance, zNA]);

//   return zDAO;
// };

const useCurrentZDAO = (zNA?: string): zDAOType | undefined | null => {
  const { zDAOs } = useSdkContext();

  return useMemo(() => {
    if (!zNA) return undefined;
    const filters = zDAOs.filter((zDAO) => zDAO.zNAs.indexOf(zNA) >= 0);
    return filters.length > 0 ? filters[0] : null;
  }, [zDAOs, zNA]);
};

export default useCurrentZDAO;
