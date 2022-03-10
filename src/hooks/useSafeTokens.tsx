import { SAFE_ADDRESS } from '@/config/constants/tokens';
import { getTokenCurrenciesBalances } from '@/helpers/gnosis-safe';
import { SafeBalanceResponse } from '@gnosis.pm/safe-react-gateway-sdk';
import { useEffect, useState } from 'react';
import useActiveWeb3React from './useActiveWeb3React';
import { useRefresh } from './useRefresh';

const useSafeTokens = (): SafeBalanceResponse | undefined => {
  const { chainId } = useActiveWeb3React();
  const [tokenCurrenciesBalances, setTokenCurrenciesBalances] =
    useState<SafeBalanceResponse>();
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetch = async (chainId: number) => {
      const tokenCurrenciesBalances = await getTokenCurrenciesBalances({
        chainId,
        safeAddress: SAFE_ADDRESS,
        selectedCurrency: 'USD',
      });
      setTokenCurrenciesBalances(tokenCurrenciesBalances);
    };

    if (chainId) {
      fetch(chainId);
    }
  }, [chainId, slowRefresh]);

  return tokenCurrenciesBalances;
};

export default useSafeTokens;
