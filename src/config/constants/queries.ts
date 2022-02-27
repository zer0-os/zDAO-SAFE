import gql from 'graphql-tag';

export const SPACES_QUERY = gql`
  query Spaces($id_in: [String]) {
    spaces(where: { id_in: $id_in }) {
      id
      name
      about
      network
      symbol
      network
      terms
      skin
      avatar
      twitter
      github
      private
      domain
      members
      admins
      categories
      plugins
      followersCount
      voting {
        delay
        period
        type
        quorum
        hideAbstain
      }
      strategies {
        name
        params
      }
      validation {
        name
        params
      }
      filters {
        minScore
        onlyMembers
      }
    }
  }
`;
