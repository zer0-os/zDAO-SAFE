/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const env = {
  ethereum: {
    zDAOChef: process.env.REACT_APP_RINKEBY_SNAPSHOT_ZDAOCHEF_ADDRESS!,
    blockNumber: Number(
      process.env.REACT_APP_RINKEBY_SNAPSHOT_ZDAOCHEF_BLOCK_NUMBER!
    ),
    rpcUrl: process.env.REACT_APP_RINKEBY_RPC_URL!,
    network: SupportedChainId.RINKEBY,
  },
  zNA: {
    zDAORegistry: process.env.REACT_APP_RINKEBY_SNAPSHOT_ZDAOREGISTRY_ADDRESS!,
    zNSHub: process.env.REACT_APP_RINKEBY_SNAPSHOT_ZNSHUB_ADDRESS!,
    rpcUrl: process.env.REACT_APP_RINKEBY_RPC_URL!,
    network: SupportedChainId.RINKEBY,
  },
  fleek: {
    apiKey: process.env.REACT_APP_FLEEK_API_KEY!,
    apiSecret: process.env.REACT_APP_FLEEK_API_SECRET!,
  },
  ipfsGateway: 'snapshot.mypinata.cloud',
};
