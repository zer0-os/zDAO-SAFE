import { ProposalState, SupportedChainId } from '@zero-tech/zdao-sdk';

export const ChainText = (chainId: SupportedChainId): string => {
  if (chainId === SupportedChainId.GOERLI) return 'Goerli';
  if (chainId === SupportedChainId.MAINNET) return 'Mainnet';
  return '';
};

export const ProposalStateText = (state: ProposalState): string => {
  if (state === ProposalState.PENDING) {
    return 'Waiting to sync proposal creation';
  }
  if (state === ProposalState.ACTIVE) {
    return 'User can cast a vote';
  }
  if (state === ProposalState.CLOSED) {
    return 'Proposal was closed';
  }
  return '';
};
