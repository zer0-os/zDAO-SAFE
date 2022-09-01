import { SupportedChainId } from '@zero-tech/zdao-sdk';

import { env } from '../env';

export const INFURA_NETWORK_URLS: { [key: number]: string } = {
  [SupportedChainId.RINKEBY]: env.ethereum.rpcUrl,
};

export const SCAN_EXPLORER_URLS: { [key: number]: string } = {
  [SupportedChainId.RINKEBY]: 'https://rinkeby.etherscan.io/',
};

interface NativeCurrencyInfo {
  name: string;
  symbol: string;
  decimals: number;
}

interface NetworkInfo {
  chainId: SupportedChainId;
  chainName: string;
  nativeCurrency: NativeCurrencyInfo;
  blockExplorerUrl: string;
  nodes: string[];
}

export const network: { [key: number]: NetworkInfo } = {
  [SupportedChainId.RINKEBY]: {
    chainId: SupportedChainId.RINKEBY,
    chainName: 'Rinkeby',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: SCAN_EXPLORER_URLS[SupportedChainId.RINKEBY],
    nodes: [INFURA_NETWORK_URLS[SupportedChainId.RINKEBY]],
  },
};
