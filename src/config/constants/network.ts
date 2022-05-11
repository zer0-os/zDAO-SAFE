import { SupportedChainId } from '@zero-tech/zdao-sdk';

import { env } from '../env';

export const INFURA_NETWORK_URLS: { [key: number]: string } = {
  [SupportedChainId.GOERLI]: env.ethereum.rpc,
  [SupportedChainId.MUMBAI]: env.polygon.rpc,
};

export const SCAN_EXPLORER_URLS: { [key: number]: string } = {
  [SupportedChainId.GOERLI]: 'https://goerli.etherscan.io/',
  [SupportedChainId.MUMBAI]: 'https://mumbai.polygonscan.com/',
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
  [SupportedChainId.POLYGON]: {
    chainId: SupportedChainId.POLYGON,
    chainName: 'Polygon mainnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrl: 'https://polygonscan.com',
    nodes: ['https://polygon-rpc.com/'],
  },
  [SupportedChainId.MUMBAI]: {
    chainId: SupportedChainId.MUMBAI,
    chainName: 'Mumbai testnet',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    blockExplorerUrl: 'https://mumbai.polygonscan.com/',
    nodes: ['https://matic-mumbai.chainstacklabs.com'],
  },
};
