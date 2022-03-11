import { SNAPSHOT_HUB } from '@/config/constants/snapshot';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client/core';
import gql from 'graphql-tag';
import cloneDeep from 'lodash/cloneDeep';

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: `${SNAPSHOT_HUB}/graphql`,
});

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    query: {
      fetchPolicy: 'no-cache',
    },
  },
  typeDefs: gql`
    enum OrderDirection {
      asc
      desc
    }
  `,
});

export const apolloQuery = async (options, path = '') => {
  const response = await apolloClient.query(options);

  return cloneDeep(!path ? response.data : response.data[path]);
};
