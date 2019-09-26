import { Loader, Message } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { adopt } from 'react-adopt';
import Signin from './Signin';
import SigninMinimalistic from './SigninMinimalistic';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';
import { client, user } from '../UI/ContentLanguage';

const Composed = adopt({
  client,
  user,
});

const PleaseSignIn = ({ action, minimalistic, hidden, children }) => {
  const router = useRouter();
  return (
    <Composed>
      {({ user: { currentUser, loading }, client }) => {
        if (loading) return <Loader active inline="centered" />;
        if (!currentUser && !hidden) {
          if (typeof window !== 'undefined' && router) {
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
                  <StyledHeader>{`Đăng nhập đẻ tiếp tục`}</StyledHeader>
                  {/* <StyledHeader>{`Please Sign In to ${action}`}</StyledHeader> */}
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
    </Composed>
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
