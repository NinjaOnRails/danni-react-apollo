import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { SIGN_OUT_MUTATION } from '../../graphql/mutation';

const onSignout = async ({ signout, client }) => {
  await signout();
  localStorage.clear();
  await client.resetStore();
  return client.query({ query: CURRENT_USER_QUERY });
};

const Signout = () => (
  <Mutation mutation={SIGN_OUT_MUTATION}>
    {signout => (
      <ApolloConsumer>
        {client => (
          <button type="button" onClick={() => onSignout({ signout, client })}>
            Sign Out
          </button>
        )}
      </ApolloConsumer>
    )}
  </Mutation>
);

export default Signout;
export { onSignout };
