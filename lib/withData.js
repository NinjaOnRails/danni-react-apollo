import { ApolloClient, InMemoryCache, HttpLink } from 'apollo-boost';
import fetch from 'isomorphic-unfetch';
import { endpoint, prodEndpoint } from '../config';

let apolloClient = null;

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint, // Server URL (must be absolute)
      credentials: 'include', // Additional fetch() options like `credentials` or `headers`
      // headers: initialState.headers,
      // Use fetch() polyfill on the server
      fetch: !process.browser && fetch,
    }),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
