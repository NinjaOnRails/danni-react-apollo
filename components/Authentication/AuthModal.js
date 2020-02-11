import { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import Signin from './Signin';
import Signup from './Signup';
import Backdrop from '../UI/Mobile/Backdrop';
import StyledModal from '../styles/AuthModalStyles';
import { useCurrentUserQuery } from './authHooks';
import { useCloseAuthModalMutation } from '../UI/uiHooks';

const AuthModal = ({ showAuthModal }) => {
  const [mode, setMode] = useState('signup');
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
AuthModal.propTypes = {
  showAuthModal: PropTypes.bool.isRequired,
};

export default AuthModal;
