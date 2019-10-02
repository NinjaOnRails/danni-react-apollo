import React from 'react';
import styled from 'styled-components';
import { Icon, Header } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import Link from 'next/link';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Signin, { closeAuthModal } from './NewSignIn';
import { user } from '../UI/ContentLanguage';
import Signup from './NewSignUp';

const StyledModal = styled.div`
  position: fixed;
  z-index: 500;
  /* background-color: rgba(0, 0, 0, 0.7); */
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  bottom: 0;
  overflow: hidden;
  transition: all 0.3s ease-out;
  transform: ${props => (props.show ? 'translateY(0)' : 'translateY(-100vh)')};
  opacity: ${props => (props.show ? 1 : 0)};
  ::after {
    background-image: linear-gradient(#000, lightgrey 34%);
    content: '';
    display: block;
    height: calc(100vh - 73% + 32px);
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 1;
  }
  .modal-navigation {
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 24px;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 2;
  }
  .modal-container {
    position: fixed;
    bottom: 0;
    height: 75%;
    width: 100%;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    /* background-color: #182f40; */
    background-color: #fff;
    align-items: center;
    bottom: 0;
    display: flex;
    flex-flow: column;
    height: 73%;
    justify-content: space-between;
    position: absolute;
    width: 100%;
    z-index: 2;
  }
  .auth-section {
    width: 100%;
  }
  .auth-section:nth-child(2) {
    margin-top: 30px;
    overflow-y: auto;
  }
  .auth-title {
    /* color: #fff; */
    color: #000;
    font-size: 30px;
    font-weight: 700;
    line-height: 30px;
    margin: 16px;
    text-align: center;
    word-wrap: break-word;
    word-break: break-word;
  }

  .Logo {
    font-size: 3rem;
    position: absolute;
    z-index: 2;
    transform: skew(-7deg);
    width: auto;
    top: -25px;
    a {
      padding: 0.5rem 1rem;
      background: ${props => props.theme.red};
      color: white;
      text-transform: uppercase;
      text-decoration: none;
    }
  }
  .ui.center.aligned.header,
  .ui.centered.header {
    margin-top: 2rem;
    font-size: 1.5em;
  }
  .auth-modes {
    display: flex;
    -ms-flex-pack: justify;
    justify-content: space-between;
  }
  .auth-mode {
    text-align: center;
    background: lightgrey;
    color: grey;
    border-radius: 24px;
    font-size: 18px;
    padding: 3px 16px;
    font-weight: 700;
    text-decoration: none;
    font-family: ${props => props.theme.font};
  }
  .auth-mode:last-child {
    margin-left: 10px;
  }
  .active {
    background-color: ${props => props.theme.red};
    color: #fff;
  }
  @media (max-width: 639px) {
    transition: all 0.3s ease-out;
    transform: ${props =>
      props.show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: ${props => (props.show ? 1 : 0)};
  }
`;

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

class FullModal extends React.Component {
  state = {
    mode: 'signin',
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
          <p className="auth-title">Tạo tài khoản miễn phí</p>
          <Signup modal />
        </div>
      );
    }
    return (
      <div className="auth-section">
        <p className="auth-title">Đăng nhập đế tiếp tục</p>
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
            <StyledModal show={showAuthModal}>
              <div className="modal-navigation">
                <div className="auth-modes">
                  <a
                    className={`auth-mode ${
                      mode === 'signin' ? 'active' : null
                    } `}
                    onClick={this.onSigninClick}
                  >
                    {mode === 'signin' ? 'Đăng nhập' : 'Đã có tài khoản?'}
                  </a>
                  <a
                    className={`auth-mode ${
                      mode === 'signup' ? 'active' : null
                    }`}
                    onClick={this.onSignupClick}
                  >
                    Đăng ký
                    {/* {mode === 'signup' ? 'Đăng ký' : 'Chưa có tài khoản?'} */}
                  </a>
                </div>
                <Icon
                  inverted
                  name="close"
                  link
                  size="large"
                  style={{
                    lineHeight: 'inherit',
                    fontSize: '3rem',
                  }}
                  onClick={closeAuthModal}
                />
              </div>
              <div className="modal-container">
                <h1 className="Logo">
                  <Link href="/">
                    <a>danni.tv</a>
                  </Link>
                </h1>
                {this.renderForm(mode)}
              </div>
            </StyledModal>
          );
        }}
      </Composed>
    );
  }
}

export default FullModal;
