import { SAFE_GATEWAY } from '@/config/constants/gnosis-safe';
import {
  getBalances,
  getTransactionHistory as getGnosisTransactionHistory,
  SafeBalanceResponse,
  TokenInfo,
  TransactionListPage,
} from '@gnosis.pm/safe-react-gateway-sdk';
import { ethers } from 'ethers';

export type TokenBalance = {
  tokenInfo: TokenInfo;
  balance: string;
  fiatBalance: string;
  fiatConversion: string;
};

type FetchTokenCurrenciesBalancesProps = {
  safeAddress: string;
  chainId: number;
  selectedCurrency: string;
  excludeSpamTokens?: boolean;
  trustedTokens?: boolean;
};

export const getTokenCurrenciesBalances = async ({
  safeAddress,
  chainId,
  selectedCurrency,
  excludeSpamTokens = true,
  trustedTokens = false,
}: FetchTokenCurrenciesBalancesProps): Promise<SafeBalanceResponse> => {
  const address = ethers.utils.getAddress(safeAddress);

  return getBalances(
    SAFE_GATEWAY,
    chainId.toString(),
    address,
    selectedCurrency,
    {
      exclude_spam: excludeSpamTokens,
      trusted: trustedTokens,
    }
  );
};

export type TransactionListType = TransactionListPage['results'];

export const getTransactionHistory = async (
  safeAddress: string,
  chainId: number
): Promise<TransactionListType> => {
  const address = ethers.utils.getAddress(safeAddress);
  const { results } = await getGnosisTransactionHistory(
    SAFE_GATEWAY,
    chainId.toString(),
    address
  );

  return results;
};
