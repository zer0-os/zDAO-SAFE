import { ProposalState, SupportedChainId } from '@zero-tech/zdao-sdk';

export const ChainText = (chainId: SupportedChainId): string => {
  if (chainId === SupportedChainId.GOERLI) return 'Goerli';
  if (chainId === SupportedChainId.MUMBAI) return 'Mumbai';
  if (chainId === SupportedChainId.RINKEBY) return 'Rinkeby';
  return '';
};

export const ProposalStateText = (state: ProposalState): string => {
  if (state === ProposalState.PENDING) {
    return 'Waiting proposal creation';
  }
  if (state === ProposalState.CANCELED) {
    return 'Proposal was canceled';
  }
  if (state === ProposalState.ACTIVE) {
    return 'User can cast a vote';
  }
  return 'Proposal was closed'; // Closed
};
