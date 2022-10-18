import { SupportedChainId } from '@zero-tech/zdao-sdk';

import { env } from '../env';

export const INFURA_NETWORK_URLS: { [key: number]: string } = {
  [SupportedChainId.GOERLI]: env.ethereum.rpcUrl,
};

export const SCAN_EXPLORER_URLS: { [key: number]: string } = {
  [SupportedChainId.GOERLI]: 'https://goerli.etherscan.io/',
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
  [SupportedChainId.GOERLI]: {
    chainId: SupportedChainId.GOERLI,
    chainName: 'Goerli',
    nativeCurrency: {
      name: 'ETH',
      symbol: 'ETH',
      decimals: 18,
    },
    blockExplorerUrl: SCAN_EXPLORER_URLS[SupportedChainId.GOERLI],
    nodes: [INFURA_NETWORK_URLS[SupportedChainId.GOERLI]],
  },
};
