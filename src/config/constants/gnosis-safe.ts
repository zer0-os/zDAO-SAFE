export const SAFE_ADDRESS =
  process.env.REACT_APP_GNOSIS_SAFE_ADDRESS ??
  '0x7a935d07d097146f143A45aA79FD8624353abD5D';
export const SAFE_SERVICE_URL =
  process.env.REACT_APP_GNOSIS_SAFE_SERVICE_URL ??
  'https://safe-transaction.rinkeby.gnosis.io';

export const TESTNET_TOKEN_LIST = {
  ETH: '',
  zDAOTesting: '0xD53C3bddf27b32ad204e859EB677f709c80E6840',
};

export const MAINNET_TOKEN_LIST = {
  ETH: '',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  ZERO: '0x0eC78ED49C2D27b315D462d43B5BAB94d2C79bf8',
  WILD: '0x2a3bff78b79a009976eea096a51a948a3dc00e34',
};
