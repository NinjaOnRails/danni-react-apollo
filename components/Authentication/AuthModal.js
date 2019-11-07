import React from 'react';
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

class AuthModal extends React.Component {
  state = {
    mode: 'signup',
  };

  onSigninClick = () => {
    this.setState({ mode: 'signin' });
  };

  onSignupClick = () => {
    this.setState({ mode: 'signup' });
  };

  renderForm = mode => {
    if (mode === 'signup') {
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

  render() {
    const { mode } = this.state;
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
                  <h2 className="Logo">danni.tv</h2>
                  <div className="auth-modes">
                    <a
                      className={`auth-mode ${
                        mode === 'signin' ? 'active' : null
                      } `}
                      onClick={this.onSigninClick}
                    >
                      Đăng nhập
                    </a>
                    <a
                      className={`auth-mode ${
                        mode === 'signup' ? 'active' : null
                      }`}
                      onClick={this.onSignupClick}
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
                  {this.renderForm(mode)}
                </div>
              </div>
            </StyledModal>
          );
        }}
      </Composed>
    );
  }
}

export default AuthModal;

export { localData };
