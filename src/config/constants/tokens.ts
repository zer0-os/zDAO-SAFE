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
  WILDER: {
    address: '0xa80152CB820463a1B50228D2b8dE50717E849BBd',
    symbol: 'WILDER',
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
