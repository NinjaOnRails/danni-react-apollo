import { USER_QUERY } from '../../graphql/query';
import UserProfile from '../../components/Authentication/UserProfile';

const User = ({ user, id }) => <UserProfile user={user} userId={id} />;

User.getInitialProps = async ({ query: { id }, apolloClient }) => {
  const {
    data: { user },
  } = await apolloClient.query({
    query: USER_QUERY,
    variables: {
      id,
    },
  });
  return { user, id };
};

export default User;
