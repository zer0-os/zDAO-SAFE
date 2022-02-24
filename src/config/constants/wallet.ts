import { AbstractConnector } from '@web3-react/abstract-connector';
import { injected } from './connectors';

import MetaMask from '@/assets/icons/metamask.svg';
import TrustWallet from '@/assets/icons/trustwallet.svg';
// import WalletConnect from '@/assets/icons/walletconnect.svg';

export enum ConnectorNames {
  Injected = 'injected',
  // WalletConnect = 'walletconnect',
}

export const CONNECTORS_BY_NAMES: {
  [key in ConnectorNames]: AbstractConnector;
} = {
  [ConnectorNames.Injected]: injected,
  // [ConnectorNames.WalletConnect]: walletconnect,
};

export const connectorLocalStorageKey = 'connectorIdv2';

export interface WalletInfo {
  title: string;
  icon: string;
  description?: string;
  connectorId: ConnectorNames;
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  MetaMask: {
    title: 'MetaMask',
    icon: MetaMask,
    description: 'Easy-to-use browser extension',
    connectorId: ConnectorNames.Injected,
  },
  // TrustWallet: {
  //   title: 'TrustWallet',
  //   icon: TrustWallet,
  //   description: 'Use TrustWallet app on mobile device',
  //   connectorId: ConnectorNames.Injected,
  // },
  // WalletConnect: {
  //   title: 'WalletConnect',
  //   icon: WalletConnect,
  //   description: 'Mobile Chrome with MetaMask, TrustWallet, Coinomi, & more',
  //   connectorId: ConnectorNames.WalletConnect,
  // },
};
