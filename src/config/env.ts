import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const env = {
  ethereum: {
    zDAOChef: process.env.REACT_APP_GOERLI_POLYGON_ZDAOCHEF_ADDRESS!,
    blockNumber: Number(
      process.env.REACT_APP_GOERLI_POLYGON_ZDAOCHEF_BLOCK_NUMBER!,
    ),
    rpcUrl: process.env.REACT_APP_GOERLI_RPC_URL!,
    network: SupportedChainId.GOERLI,
  },
  polygon: {
    zDAOChef: process.env.REACT_APP_MUMBAI_POLYGON_ZDAOCHEF_ADDRESS!,
    blockNumber: Number(
      process.env.REACT_APP_MUMBAI_POLYGON_ZDAOCHEF_BLOCK_NUMBER!,
    ),
    rpcUrl: process.env.REACT_APP_MUMBAI_RPC_URL!,
    network: SupportedChainId.MUMBAI,
  },
  zNA: {
    zDAORegistry: process.env.REACT_APP_GOERLI_POLYGON_ZDAOREGISTRY_ADDRESS!,
    zNSHub: process.env.REACT_APP_GOERLI_POLYGON_ZNSHUB_ADDRESS!,
    rpcUrl: process.env.REACT_APP_GOERLI_RPC_URL!,
    network: SupportedChainId.GOERLI,
  },
  proof: {
    from: '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C',
  },
  fleek: {
    apiKey: process.env.REACT_APP_FLEEK_API_KEY!,
    apiSecret: process.env.REACT_APP_FLEEK_API_SECRET!,
  },
  ipfsGateway: 'snapshot.mypinata.cloud',
  zNSProvider: {
    rpcUrl: process.env.REACT_APP_RINKEBY_RPC_URL!,
    network: SupportedChainId.RINKEBY,
  },
};
