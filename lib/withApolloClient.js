import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';
import { resolvers, typeDefs, data } from './resolvers';

const uri = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint;

let apolloClient = null;
const isBrowser = typeof window !== 'undefined';

function create(initialState) {
  // Check out https://github.com/zeit/next.js/pull/4611 if you want to use the AWSAppSyncClient
  const cache = new InMemoryCache();
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
    resolvers,
    typeDefs,
    cache,
    // cache: new InMemoryCache().restore(initialState || {}),
    // local data
  });
  cache.writeData({ data });
  client.onResetStore(() => cache.writeData({ data }));
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
export { isBrowser };
