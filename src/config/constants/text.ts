import { ProposalState, SupportedChainId } from '@zero-tech/zdao-sdk';

export const ChainText = (chainId: SupportedChainId): string => {
  if (chainId === SupportedChainId.GOERLI) return 'Goerli';
  if (chainId === SupportedChainId.MUMBAI) return 'Mumbai';
  return '';
};

export const ProposalStateText = (state: ProposalState): string => {
  if (state === 'pending') {
    return 'Waiting to sync proposal creation';
  }
  if (state === 'canceled') {
    return 'Proposal was canceled';
  }
  if (state === 'active') {
    return 'User can cast a vote';
  }
  if (state === 'queueing') {
    return 'Waiting for collecting';
  }
  if (state === 'collecting') {
    return 'Waiting to sync proposal collection';
  }
  if (state === 'succeeded') {
    return 'Proposal can be executable';
  }
  if (state === 'failed') {
    return 'Proposal was failed';
  }
  return 'Successfully executed';
};
