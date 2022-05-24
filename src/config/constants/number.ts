import BigNumber from 'bignumber.js';

export const BIG_TEN = new BigNumber(10);
export const BIG_EITEEN = new BigNumber(10).pow(18);
export const DECIMALS = 4;

export const extendToDecimals = (decimals: number): BigNumber => {
  return new BigNumber(10).pow(decimals);
};

export const getFullDisplayBalance = (
  balance: BigNumber,
  decimals = 18,
  displayDecimals?: number,
) => {
  return getBalanceAmount(balance, decimals)
    .toNumber()
    .toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: displayDecimals ?? DECIMALS,
    });
};

export const getBalanceAmount = (amount: BigNumber, decimals = 18) => {
  return new BigNumber(amount).dividedBy(BIG_TEN.pow(decimals));
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getFormatedValue = (value: any) =>
  parseFloat(value).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: DECIMALS,
  });
