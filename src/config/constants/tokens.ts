import { SupportedChainId } from '@zero-tech/zdao-sdk';

export interface TokenType {
  address: string;
  symbol: string;
  decimals: number;
}

export const TESTNET_TOKEN_LIST: { [token: string]: TokenType } = {
  ETH: {
    address: '',
    symbol: 'ETH',
    decimals: 18,
  },
  zDAOTesting: {
    address: '0xD53C3bddf27b32ad204e859EB677f709c80E6840',
    symbol: 'zDAOTesting',
    decimals: 18,
  },
};

// export const MAINNET_TOKEN_LIST: { [token: string]: TokenType } = {
//   ETH: {
//     address: '',
//     decimals: 18,
//   },
//   USDC: {
//     address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
//     decimals: 6,
//   },
//   ZERO: {
//     address: '0x0eC78ED49C2D27b315D462d43B5BAB94d2C79bf8',
//     decimals: 18,
//   },
//   WILD: {
//     address: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
//     decimals: 18,
//   },
// };

export const getToken = (
  chainId: number,
  address: string
): TokenType | undefined => {
  if (chainId === SupportedChainId.RINKEBY) {
    const key = Object.keys(TESTNET_TOKEN_LIST).find(
      (token: string) => TESTNET_TOKEN_LIST[token].address === address
    );
    return key ? TESTNET_TOKEN_LIST[key] : undefined;
  }
  return undefined;
};
