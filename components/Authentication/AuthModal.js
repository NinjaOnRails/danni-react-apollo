import React, { useState } from 'react';
import { Icon } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Signin, { closeAuthModal } from './Signin';
import { user } from '../UI/ContentLanguage';
import Signup from './Signup';
import Backdrop from '../UI/Mobile/Backdrop';
import StyledModal from '../styles/AuthModalStyles';

/* eslint-disable */
const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);
/* eslint-enable */

const Composed = adopt({
  closeAuthModal,
  localData,
  user,
});

const AuthModal = () => {
  const [mode, setMode] = useState('signup');
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
    <Composed>
      {({
        closeAuthModal,
        localData: {
          data: { showAuthModal },
        },
        user: { currentUser },
      }) => {
        return (
          <StyledModal show={showAuthModal && !currentUser}>
            <Backdrop
              show={showAuthModal && !currentUser}
              clicked={closeAuthModal}
            />
            <div className="Modal">
              <div className="modal-container">
                <h1 className="Logo">danni.tv</h1>
                <div className="auth-modes">
                  <a
                    className={`auth-mode ${
                      mode === 'signin' ? 'active' : null
                    } `}
                    onClick={() => setMode('signin')}
                  >
                    Đăng nhập
                  </a>
                  <a
                    className={`auth-mode ${
                      mode === 'signup' ? 'active' : null
                    }`}
                    onClick={() => setMode('signup')}
                  >
                    Đăng ký
                  </a>
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
      }}
    </Composed>
  );
};

export default AuthModal;

export { localData };
