import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from './User';

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const Signout = () => (
  <Mutation mutation={SIGN_OUT_MUTATION}>
    {signout => (
      <ApolloConsumer>
        {client => (
          <button
            type="button"
            onClick={async () => {
              await signout();
              localStorage.clear();
              await client.resetStore();
              client.query({ query: CURRENT_USER_QUERY });
            }}
          >
            Sign Out
          </button>
        )}
      </ApolloConsumer>
    )}
  </Mutation>
);
export default Signout;
export { SIGN_OUT_MUTATION };
