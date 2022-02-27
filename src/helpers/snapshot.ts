import {
  PROPOSAL_QUERY,
  SPACES_QUERY,
  VOTES_QUERY,
} from '@/config/constants/queries';
import { apolloQuery } from './apollo';

export const getSpaces = async (id) => {
  try {
    console.time('getSpaces');
    const response = await apolloQuery(
      {
        query: SPACES_QUERY,
        variables: {
          id,
        },
      },
      'spaces'
    );
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getProposal = async (id) => {
  try {
    console.time('getProposal');
    const response = await apolloQuery(
      {
        query: PROPOSAL_QUERY,
        variables: {
          id,
        },
      },
      'proposal'
    );
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export async function getProposalVotes(
  proposalId: string,
  { first, voter, skip }: any = { first: 30000, voter: '', skip: 0 }
) {
  try {
    console.time('getProposalVotes');
    const response = await apolloQuery(
      {
        query: VOTES_QUERY,
        variables: {
          id: proposalId,
          orderBy: 'vp',
          orderDirection: 'desc',
          first,
          voter,
          skip,
        },
      },
      'votes'
    );
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
}
