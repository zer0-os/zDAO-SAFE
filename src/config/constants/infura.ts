import { SupportedChainId } from '@zero-tech/zdao-sdk';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`,
  );
}

// todo
export const INFURA_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.GOERLI]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.MUMBAI]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.POLYGON]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
};

export const SCAN_EXPLORER_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.MAINNET]: 'https://etherscan.io/',
  [SupportedChainId.RINKEBY]: 'https://rinkeby.etherscan.io/',
  [SupportedChainId.GOERLI]: 'https://rinkeby.etherscan.io/',
  [SupportedChainId.MUMBAI]: 'https://rinkeby.etherscan.io/',
  [SupportedChainId.POLYGON]: 'https://rinkeby.etherscan.io/',
};
