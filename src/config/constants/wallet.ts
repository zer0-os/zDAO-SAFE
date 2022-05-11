import { AbstractConnector } from '@web3-react/abstract-connector';

import MetaMask from '../../assets/icons/metamask.svg';
import { injected } from './connectors';

// eslint-disable-next-line no-shadow
export enum ConnectorNames {
  Injected = 'injected',
}

export const CONNECTORS_BY_NAMES: {
  [key in ConnectorNames]: AbstractConnector;
} = {
  [ConnectorNames.Injected]: injected,
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
};
