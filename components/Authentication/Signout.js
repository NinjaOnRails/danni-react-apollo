import { useApolloClient } from '@apollo/react-hooks';
import { useSignoutMutation } from './authHooks';
import { CURRENT_USER_QUERY } from '../../graphql/query';

const onSignout = async ({ signout, client }) => {
  await signout();
  localStorage.clear();
  await client.resetStore();
  if (FB && FB.getAccessToken()) FB.logout();
  return client.query({ query: CURRENT_USER_QUERY });
};

const Signout = () => {
  const [signout] = useSignoutMutation();
  const client = useApolloClient();

  return (
    <button type="button" onClick={() => onSignout({ signout, client })}>
      Log out
    </button>
  );
};
export default Signout;
export { onSignout };
