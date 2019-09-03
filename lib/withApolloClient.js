import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import withApollo from 'next-with-apollo';
import gql from 'graphql-tag';
import {
  CLOSE_SIDEDRAWER_MUTATION,
  LOCAL_STATE_QUERY,
} from '../components/UI/Mobile/SideDrawer';
import { TOGGLE_SIDEDRAWER_MUTATION } from '../components/UI/Header';
import { endpoint, prodEndpoint } from '../config';

const uri = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint;

let apolloClient = null;

const typeDefs = gql`
  extend type Query {
    showSide: Boolean!
  }
`;
function create(initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const isBrowser = typeof window !== 'undefined';
  const setupCache = new InMemoryCache();
  const data = { showSide: false };
  const client = new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: createHttpLink({
      uri, // Server URL (must be absolute)
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      // Use fetch() polyfill on the server
      fetch: !isBrowser && fetch,
      // headers: initialState.headers,
    }),
    resolvers: {
      Mutation: {
        toggleSideDrawer: (_, variables, { cache }) => {
          const { showSide } = cache.readQuery({
            query: LOCAL_STATE_QUERY,
          });
          const mutatedData = {
            showSide: !showSide,
          };
          console.log(showSide, 'toggle');
          cache.writeData({ data: mutatedData });
          return null;
        },
        closeSideDrawer: (_, variables, { cache }) => {
          const mutatedData = {
            showSide: false,
          };
          console.log('close');
          cache.writeData({ data: mutatedData });
          return null;
        },
      },
    },
    typeDefs,
    cache: setupCache,
    // cache: new InMemoryCache().restore(initialState || {}),
    // local data
  });
  setupCache.writeData({ data });
  return client;
}

function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === 'undefined') {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}

export default withApollo(initApollo);
