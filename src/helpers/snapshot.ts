import {
  PROPOSAL_QUERY,
  SPACES_QUERY,
  VOTES_QUERY,
} from '@/config/constants/queries';
import Client from '@snapshot-labs/snapshot.js';
import { apolloQuery } from './apollo';

export const getSpaces = async (spaceIds: string[]) => {
  try {
    console.time('getSpaces');
    const response = await apolloQuery(
      {
        query: SPACES_QUERY,
        variables: {
          id_in: spaceIds,
        },
      },
      'spaces'
    );
    console.timeEnd('getSpaces');
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getProposal = async (proposalId: string) => {
  try {
    console.time('getProposal');
    const response = await apolloQuery(
      {
        query: PROPOSAL_QUERY,
        variables: {
          id: proposalId,
        },
      },
      'proposal'
    );
    console.timeEnd('getProposal');
    return response;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getProposalVotes = async (
  proposalId: string,
  { first, voter, skip }: any = { first: 30000, voter: '', skip: 0 }
) => {
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
    console.timeEnd('getProposalVotes');
    return response;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const getResults = async (space, proposal, votes) => {
  console.log('[score] getResults');
  const voters = votes.map((vote) => vote.voter);
  const strategies = proposal.strategies ?? space.strategies;
  /* Get scores */
  if (proposal.state !== 'pending') {
    console.time('getProposal.scores');
    const scores = await Client.utils.getScores(
      space.id,
      strategies,
      proposal.network,
      voters,
      parseInt(proposal.snapshot)
    );
    console.timeEnd('getProposal.scores');

    votes = votes
      .map((vote: any) => {
        vote.scores = strategies.map(
          (strategy, i) => scores[i][vote.voter] || 0
        );
        vote.balance = vote.scores.reduce((a, b: any) => a + b, 0);
        return vote;
      })
      .sort((a, b) => b.balance - a.balance)
      .filter((vote) => vote.balance > 0);
  }

  /* Get results */
  const votingClass = new Client.utils.voting[proposal.type](
    proposal,
    votes,
    strategies
  );
  const results = {
    resultsByVoteBalance: votingClass.resultsByVoteBalance(),
    resultsByStrategyScore: votingClass.resultsByStrategyScore(),
    sumOfResultsBalance: votingClass.sumOfResultsBalance(),
  };

  return { votes, results };
};

export const getPower = async (space, address, proposal) => {
  console.time('[score] getPower');
  const strategies = proposal.strategies ?? space.strategies;
  let scores: any = await Client.utils.getScores(
    space.id,
    strategies,
    proposal.network,
    [address],
    parseInt(proposal.snapshot)
  );
  scores = scores.map((score: any) =>
    Object.values(score).reduce((a, b: any) => a + b, 0)
  );
  return {
    scores,
    totalScore: scores.reduce((a, b: any) => a + b, 0),
  };
};
