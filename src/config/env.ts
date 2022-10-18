import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const env = {
  ethereum: {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    rpcUrl: process.env.REACT_APP_GOERLI_RPC!,
    network: SupportedChainId.GOERLI,
  },
  ipfsGateway: 'zer0.infura-ipfs.io',
};
