import { Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import Signin from './Signin';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';
import { client, user } from '../UI/ContentLanguage';
import { OPEN_AUTH_MODAL_MUTATION } from '../../graphql/mutation';
import { isBrowser } from '../../lib/withApolloClient';

/* eslint-disable */
const openAuthModal = ({ render }) => (
  <Mutation mutation={OPEN_AUTH_MODAL_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const Composed = adopt({
  client,
  user,
});

const PleaseSignIn = ({ action, modal, children }) => {
  const router = useRouter();
  return (
    <Composed>
      {({ user: { currentUser, loading }, client }) => {
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
    </Composed>
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
