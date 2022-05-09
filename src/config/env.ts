import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const env = {
  ethereum: {
    zDAOChef: process.env.REACT_GOERLI_ZDAOCHEF_ADDRESS!,
    rpc: process.env.REACT_GOERLI_RPC_URL!,
    network: SupportedChainId.GOERLI!,
    blockNumber: Number(process.env.REACT_GOERLI_BLOCK_NUMBER!),
  },
  polygon: {
    zDAOChef: process.env.REACT_MUMBAI_ZDAOCHEF_ADDRESS!,
    rpc: process.env.REACT_MUMBAI_RPC_URL!,
    network: SupportedChainId.MUMBAI!,
    blockNumber: Number(process.env.REACT_MUMBAI_BLOCK_NUMBER!),
  },
  fleek: {
    apiKey: process.env.REACT_FLEEK_API_KEY!,
    apiSecret: process.env.REACT_FLEEK_API_SECRET!,
  },
};

export const proofFrom = '0x22C38E74B8C0D1AAB147550BcFfcC8AC544E0D8C';
