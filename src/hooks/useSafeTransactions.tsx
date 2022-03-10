import { SAFE_ADDRESS } from '@/config/constants/gnosis-safe';
import {
  getTransactionHistory,
  TransactionListType,
} from '@/helpers/gnosis-safe';
import { useEffect, useState } from 'react';
import useActiveWeb3React from './useActiveWeb3React';
import { useRefresh } from './useRefresh';

const useSafeTransactions = (): TransactionListType | undefined => {
  const { chainId } = useActiveWeb3React();
  const [transactionList, setTransactionList] = useState<
    TransactionListType | undefined
  >(undefined);
  const { slowRefresh } = useRefresh();

  useEffect(() => {
    const fetch = async (chainId: number) => {
      try {
        const txs = await getTransactionHistory(SAFE_ADDRESS, chainId);
        setTransactionList(txs.filter((tx) => tx.type === 'TRANSACTION'));
      } catch (error) {
        setTransactionList(undefined);
      }
    };

    if (chainId) {
      fetch(chainId);
    }
  }, [chainId, slowRefresh]);

  return transactionList;
};

export default useSafeTransactions;
