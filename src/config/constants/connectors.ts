import { InjectedConnector } from '@web3-react/injected-connector';
import { SupportedChainId } from '@zero-tech/zdao-sdk';

// import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
// import { INFURA_NETWORK_URLS } from './infura';

export const injected = new InjectedConnector({
  supportedChainIds: [SupportedChainId.GOERLI],
});

// export const walletconnect = new WalletConnectConnector({
//   supportedChainIds: ALL_SUPPORTED_CHAIN_IDS,
//   rpc: INFURA_NETWORK_URLS,
//   qrcode: true,
// });
