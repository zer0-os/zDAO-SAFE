import { SupportedChainId } from './chain';

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY;
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(
    `REACT_APP_INFURA_KEY must be a defined environment variable`
  );
}

export const INFURA_NETWORK_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.ETHEREUM]: `https://mainnet.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.ROPSTEN]: `https://ropsten.infura.io/v3/${INFURA_KEY}`,
  [SupportedChainId.RINKEBY]: `https://rinkeby.infura.io/v3/${INFURA_KEY}`,
};

export const SCAN_EXPLORER_URLS: { [key in SupportedChainId]: string } = {
  [SupportedChainId.ETHEREUM]: 'https://etherscan.io/',
  [SupportedChainId.ROPSTEN]: 'https://ropsten.etherscan.io/',
  [SupportedChainId.RINKEBY]: 'https://rinkeby.etherscan.io/',
};
