import { useState } from 'react';
import { Query } from 'react-apollo';
import { Icon } from 'semantic-ui-react';
import Signin from './Signin';
import Signup from './Signup';
import Backdrop from '../UI/Mobile/Backdrop';
import StyledModal from '../styles/AuthModalStyles';
import { useCurrentUserQuery, useLocalStateQuery } from './authHooks';
import { useCloseAuthModalMutation } from '../UI/uiHooks';
import { LOCAL_STATE_QUERY } from '../../graphql/query';

/* eslint-disable */
const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);
/* eslint-enable */

const AuthModal = () => {
  const [mode, setMode] = useState('signup');
  const { showAuthModal } = useLocalStateQuery();
  const [closeAuthModal] = useCloseAuthModalMutation();
  const { currentUser } = useCurrentUserQuery();

  return (
    <StyledModal show={showAuthModal && !currentUser}>
      <Backdrop show={showAuthModal && !currentUser} clicked={closeAuthModal} />
      <div className="Modal">
        <div className="modal-container">
          <h2 className="Logo">danni.tv</h2>
          <div className="auth-modes">
            <button
              type="button"
              className={`auth-mode ${mode === 'signin' ? 'active' : null} `}
              onClick={() => setMode('signin')}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              className={`auth-mode ${mode === 'signup' ? 'active' : null}`}
              onClick={() => setMode('signup')}
            >
              Đăng ký
            </button>
          </div>
          <Icon
            inverted
            name="close"
            link
            size="large"
            onClick={closeAuthModal}
          />
          <div className="auth-section">
            {mode === 'signup' ? <Signup modal /> : <Signin modal />}
          </div>
        </div>
      </div>
    </StyledModal>
  );
};

export default AuthModal;

export { localData };
