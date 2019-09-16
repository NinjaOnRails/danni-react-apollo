import { Query, ApolloConsumer } from 'react-apollo';
import { Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { CURRENT_USER_QUERY } from './User';
import Signin from './Signin';
import SigninMinimalistic from './SigninMinimalistic';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';

const PleaseSignIn = ({ action, minimalistic, hidden, children }) => {
  const router = useRouter();
  return (
    <ApolloConsumer>
      {client => (
        <Query query={CURRENT_USER_QUERY}>
          {({ data, loading }) => {
            if (loading) return <Loader active inline="centered" />;
            if (!data.currentUser && !hidden) {
              if (router) {
                const currentPath = router.asPath;
                localStorage.setItem('previousPage', currentPath);
                client.writeData({
                  data: { previousPage: currentPath },
                });
              }
              return (
                <>
                  <StyledMessage>
                    <Message warning>
                      <StyledHeader>{`Please Sign In to ${action}`}</StyledHeader>
                    </Message>
                  </StyledMessage>
                  {minimalistic ? (
                    <SigninMinimalistic noRedirect />
                  ) : (
                    <Signin noRedirect />
                  )}
                </>
              );
            }
            return children;
          }}
        </Query>
      )}
    </ApolloConsumer>
  );
};

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  action: PropTypes.string,
  minimalistic: PropTypes.bool,
  hidden: PropTypes.bool,
};

PleaseSignIn.defaultProps = {
  children: null,
  action: 'Continue',
  minimalistic: false,
  hidden: false,
};

export default PleaseSignIn;
