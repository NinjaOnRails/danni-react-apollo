import { ApolloConsumer } from 'react-apollo';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { useSignoutMutation } from './authHooks';
// import { onSignout } from './utils';

const onSignout = async ({ signout, client }) => {
  await signout();
  localStorage.clear();
  await client.resetStore();
  if (FB && FB.getAccessToken()) FB.logout();
  return client.query({ query: CURRENT_USER_QUERY });
};

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
export { onSignout };
