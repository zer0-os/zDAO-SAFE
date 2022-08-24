import { Polygon, ProposalState, SupportedChainId } from '@zero-tech/zdao-sdk';

export const ChainText = (chainId: SupportedChainId): string => {
  if (chainId === SupportedChainId.GOERLI) return 'Goerli';
  if (chainId === SupportedChainId.MUMBAI) return 'Mumbai';
  return '';
};

export const ProposalStateText = (state: ProposalState): string => {
  if (state === ProposalState.PENDING) {
    return 'Waiting to sync proposal creation';
  }
  if (state === ProposalState.CANCELED) {
    return 'Proposal was canceled';
  }
  if (state === ProposalState.ACTIVE) {
    return 'User can cast a vote';
  }
  if (state === ProposalState.AWAITING_CALCULATION) {
    return 'Calculating voting result';
  }
  if (state === ProposalState.AWAITING_FINALIZATION) {
    return 'Finalizing voting result';
  }
  if (state === ProposalState.AWAITING_EXECUTION) {
    return 'Proposal is executable';
  }
  if (state === ProposalState.CLOSED) {
    return 'Proposal was closed';
  }
  return 'Successfully executed';
};

export const VoteChoiceText = {
  [Polygon.VoteChoice.YES]: 'Yes',
  [Polygon.VoteChoice.NO]: 'No',
};
