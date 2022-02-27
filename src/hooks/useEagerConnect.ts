import {
  connectorLocalStorageKey,
  ConnectorNames,
} from '@/config/constants/wallet';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';

const useEagerConnect = () => {
  const { login } = useAuth();

  useEffect(() => {
    const connectorId = window.localStorage.getItem(
      connectorLocalStorageKey
    ) as ConnectorNames;

    if (connectorId) {
      login(connectorId);
    }
  }, [login]);
};

export default useEagerConnect;
