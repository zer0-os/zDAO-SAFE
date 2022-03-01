export const shortenProposalId = (proposalId: string, chars = 4): string => {
  const parsed = proposalId.startsWith('0x');
  // if (!parsed) {
  //   throw Error(`Invalid 'proposalId' parameter '${proposalId}'.`);
  // }
  return `${proposalId.substring(0, chars + 2)}...${proposalId.substring(
    proposalId.length - chars
  )}`;
};
