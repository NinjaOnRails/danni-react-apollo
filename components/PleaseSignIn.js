import { Query } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';

const PleaseSignIn = props => (
  <Query query={CURRENT_USER_QUERY}>
    {({ data, loading }) => {
      if (loading) return <Loader active inline="centered" />;
      if (!data.user) {
        return (
          <div>
            <p>Đăng Nhập Để Tiếp Tục</p>
            <Signin />
          </div>
        );
      }
      return props.children;
    }}
  </Query>
);

export default PleaseSignIn;
