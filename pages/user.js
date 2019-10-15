import { USER_QUERY } from '../graphql/query';
import UserProfile from '../components/Authentication/UserProfile';

const User = ({ payload, id }) => <UserProfile payload={payload} userId={id} />;

User.getInitialProps = async ({ query: { id }, apolloClient }) => {
  const payload = await apolloClient.query({
    query: USER_QUERY,
    variables: {
      id,
    },
  });
  return { payload, id };
};

export default User;
