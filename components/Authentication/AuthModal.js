import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import Signin from './Signin';
import Signup from './Signup';
import Backdrop from '../UI/Mobile/Backdrop';
import StyledModal from '../styles/AuthModalStyles';
import { useCurrentUserQuery, useLocalDataQuery } from './authHooks';
import { useCloseAuthModalMutation } from '../UI/uiHooks';

const AuthModal = () => {
  const [mode, setMode] = useState('signup');
  const {
    data: { showAuthModal },
  } = useLocalDataQuery();
  const [closeAuthModal] = useCloseAuthModalMutation();
  const { currentUser } = useCurrentUserQuery();
  const renderForm = authMode => {
    if (authMode === 'signup') {
      return (
        <div className="auth-section">
          <Signup modal />
        </div>
      );
    }
    return (
      <div className="auth-section">
        <Signin modal />
      </div>
    );
  };
  return (
    <StyledModal show={showAuthModal && !currentUser}>
      <Backdrop show={showAuthModal && !currentUser} clicked={closeAuthModal} />
      <div className="Modal">
        <div className="modal-container">
          <h1 className="Logo">danni.tv</h1>
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
          {renderForm(mode)}
        </div>
      </div>
    </StyledModal>
  );
};

export default AuthModal;
