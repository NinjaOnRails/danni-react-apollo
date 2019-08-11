import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import withApollo from 'next-with-apollo';
import { endpoint, prodEndpoint } from '../config';

let apolloClient = null;

const uri = process.env.NODE_ENV === 'development' ? endpoint : prodEndpoint;

const create = ({ ctx, headers, initialState }) => {
  const isBrowser = typeof window !== 'undefined';
  return new ApolloClient(
    {
      connectToDevTools: isBrowser,
      ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
      link: createHttpLink({
        uri, // Server URL (must be absolute)
        credentials: 'include', // Additional fetch() options like `credentials` or `headers`
        // Use fetch() polyfill on the server
        headers,
        fetch: !isBrowser && fetch,
      }),
      cache: new InMemoryCache().restore(initialState || {}),
    },
    {
      getDataFromTree: 'ssr',
    }
  );
};

export default withApollo(initialState => {
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
});
