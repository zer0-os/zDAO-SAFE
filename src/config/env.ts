import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const env = {
  ethereum: {
    rpcUrl: process.env.REACT_APP_RINKEBY_RPC!,
    network: SupportedChainId.RINKEBY,
  },
  ipfsGateway: 'zer0.infura-ipfs.io',
};
