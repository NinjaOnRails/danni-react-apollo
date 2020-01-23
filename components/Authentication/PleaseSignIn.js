import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { Loader, Message } from 'semantic-ui-react';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';
import Signin from './Signin';
import { isBrowser } from '../../lib/withApolloClient';
import { useCurrentUserQuery } from './authHooks';
import { OPEN_AUTH_MODAL_MUTATION } from '../../graphql/mutation';
/* eslint-disable */
const openAuthModal = ({ render }) => (
  <Mutation mutation={OPEN_AUTH_MODAL_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const PleaseSignIn = ({ action, modal, children }) => {
  const router = useRouter();
  const { currentUser, loading } = useCurrentUserQuery();

  return (
    <ApolloConsumer>
      {client => {
        if (loading) return <Loader active inline="centered" />;
        if (!currentUser) {
          if (isBrowser && router && !modal) {
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
                  <StyledHeader>{`Đăng nhập để ${action}`}</StyledHeader>
                </Message>
              </StyledMessage>
              <Signin noRedirect />
            </>
          );
        }
        return children;
      }}
    </ApolloConsumer>
  );
};

PleaseSignIn.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  action: PropTypes.string,
  modal: PropTypes.bool,
};

PleaseSignIn.defaultProps = {
  children: null,
  action: 'tiếp tục',
  modal: false,
};

export default PleaseSignIn;
export { openAuthModal };
