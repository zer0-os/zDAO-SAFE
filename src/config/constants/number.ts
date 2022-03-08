import BigNumber from 'bignumber.js';

export const BIG_EITEEN = new BigNumber(10).pow(18);
export const DECIMALS = 4;

export const extendToDecimals = (decimals: number): BigNumber => {
  return new BigNumber(10).pow(decimals);
};
