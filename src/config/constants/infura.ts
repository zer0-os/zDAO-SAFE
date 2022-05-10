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
