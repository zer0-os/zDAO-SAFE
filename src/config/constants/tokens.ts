import { SupportedChainId } from '@zero-tech/zdao-sdk';

export const SAFE_ADDRESS =
  process.env.REACT_APP_GNOSIS_SAFE_ADDRESS ??
  '0x7a935d07d097146f143A45aA79FD8624353abD5D';
export const SAFE_SERVICE_URL =
  process.env.REACT_APP_GNOSIS_SAFE_SERVICE_URL ??
  'https://safe-transaction.rinkeby.gnosis.io';

export interface TokenType {
  address: string;
  decimals: number;
}

export const TESTNET_TOKEN_LIST: { [token: string]: TokenType } = {
  ETH: {
    address: '',
    decimals: 18,
  },
  zDAOTesting: {
    address: '0xD53C3bddf27b32ad204e859EB677f709c80E6840',
    decimals: 18,
  },
};

export const MAINNET_TOKEN_LIST: { [token: string]: TokenType } = {
  ETH: {
    address: '',
    decimals: 18,
  },
  USDC: {
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  ZERO: {
    address: '0x0eC78ED49C2D27b315D462d43B5BAB94d2C79bf8',
    decimals: 18,
  },
  WILD: {
    address: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
    decimals: 18,
  },
};

export const getToken = (
  chainId: number,
  address: string,
): TokenType | undefined => {
  if (chainId === SupportedChainId.MAINNET) {
    const key = Object.keys(MAINNET_TOKEN_LIST).find((token: string) =>
      MAINNET_TOKEN_LIST[token].address === address ? true : false,
    );
    return key ? MAINNET_TOKEN_LIST[key] : undefined;
  }
  const key = Object.keys(TESTNET_TOKEN_LIST).find((token: string) =>
    TESTNET_TOKEN_LIST[token].address === address ? true : false,
  );
  return key ? TESTNET_TOKEN_LIST[key] : undefined;
};
