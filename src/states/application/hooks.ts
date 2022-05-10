import { useSelector } from 'react-redux';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
import { AppState } from '..';
import { ApplicationStatus } from '.';

export const useApplicationStatus = (): ApplicationStatus => {
  return useSelector((state: AppState) => state.application.applicationStatus);
};

export function useBlockNumber(): number | undefined {
  const { chainId } = useActiveWeb3React();

  return useSelector(
    (state: AppState) => state.application.blockNumber[chainId ?? -1],
  );
}

export function useChainId(): number {
  return useSelector((state: AppState) => state.application.chainId);
}
