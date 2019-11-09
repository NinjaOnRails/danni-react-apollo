import { useQuery } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY } from '../../graphql/query';

const User = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  const currentUser = data ? data.currentUser : null;

  return { currentUser, loading };
};

export default User;
