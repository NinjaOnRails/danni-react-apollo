import React from 'react';
import { ApolloConsumer } from 'react-apollo';
import { useSignoutMutation } from './authHooks';
import { onSignout } from './utils';

const Signout = () => {
  const [signout] = useSignoutMutation();
  return (
    <ApolloConsumer>
      {client => (
        <button type="button" onClick={() => onSignout({ signout, client })}>
          Đăng Xuất
        </button>
      )}
    </ApolloConsumer>
  );
};
export default Signout;
