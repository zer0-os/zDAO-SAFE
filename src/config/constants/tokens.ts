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
    address: '0x1981cc4517AB60A2edcf62f4E5817eA7A89F96fe',
    symbol: 'zDAOVT',
    decimals: 18,
  },
};

export const getToken = (
  chainId: number,
  address: string,
): TokenType | undefined => {
  if (chainId === SupportedChainId.GOERLI) {
    const key = Object.keys(TESTNET_TOKEN_LIST).find(
      (token: string) => TESTNET_TOKEN_LIST[token].address === address,
    );
    return key ? TESTNET_TOKEN_LIST[key] : undefined;
  }
  return undefined;
};
