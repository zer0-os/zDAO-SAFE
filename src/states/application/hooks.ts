import useActiveWeb3React from '@/hooks/useActiveWeb3React';
import { useSelector } from 'react-redux';
import { AppState } from '../';

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1]
  );
}

export function useChainId(): number {
  return useSelector((state: AppState) => state.application.chainId);
}
