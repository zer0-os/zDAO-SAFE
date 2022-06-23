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
    symbol: 'zDAOVoting',
    decimals: 18,
  },
};

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
