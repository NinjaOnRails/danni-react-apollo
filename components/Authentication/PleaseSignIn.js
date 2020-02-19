import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useApolloClient } from '@apollo/react-hooks';
import { Loader, Message } from 'semantic-ui-react';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';
import Signin from './Signin';
import { isBrowser } from '../../lib/withApolloClient';
import { useCurrentUserQuery } from './authHooks';

const PleaseSignIn = ({ action, modal, children }) => {
  const router = useRouter();
  const { currentUser, loading } = useCurrentUserQuery();
  const client = useApolloClient();

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
            <StyledHeader>{`Please log in to ${action}`}</StyledHeader>
          </Message>
        </StyledMessage>
        <Signin noRedirect />
      </>
    );
  }
  return children;
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
  action: 'continue',
  modal: false,
};

export default PleaseSignIn;
