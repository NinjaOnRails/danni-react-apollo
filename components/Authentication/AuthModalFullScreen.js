import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import Link from 'next/link';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Signin, { closeAuthModal } from './NewSignIn';
import { user } from '../UI/ContentLanguage';
import Signup from './NewSignUp';
import Backdrop from '../UI/Mobile/Backdrop';

const StyledModal = styled.div`
  .Modal {
    position: fixed;
    z-index: 500;
    width: 40%;
    left: 30%;
    top: 20%;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    transform: ${props =>
      props.show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: ${props => (props.show ? 1 : 0)};
  }
  .modal-container {
    height: 100%;
    width: 100%;
    border-radius: 16px;
    background-color: #fff;
    align-items: center;
    display: flex;
    flex-flow: column;
    /* justify-content: space-between; */
    z-index: 500;
  }
  .auth-section {
    width: 100%;
    overflow-y: auto;
  }
  .Logo {
    cursor: default;
    font-size: 3rem;
    position: absolute;
    z-index: 500;
    transform: skew(-7deg);
    width: auto;
    top: -25px;
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  /* .auth-modes {
    position: absolute;
    left: -125px;
    width: auto;
    z-index: 500;
  } */
  .auth-modes {
    position: initial;
    display: flex;
    padding: 10px;
    width: auto;
    margin-top: 20px;
  }
  .auth-mode:last-child {
    margin-left: 10px;
    margin-top: 0;
  }
  .auth-mode {
    display: block;
    text-align: center;
    margin: auto;
    cursor: pointer;
    background: lightgrey;
    color: grey;
    border-radius: 24px;
    font-size: 18px;
    padding: 6px 16px;
    font-weight: 700;
    text-decoration: none;
    font-family: ${props => props.theme.font};
  }
  /* .auth-mode:last-child {
    margin-top: 10px;
  } */
  .auth-modes .active {
    background-color: ${props => props.theme.red};
    color: #fff;
  }
  i.large.icon,
  i.large.icons {
    top: -10%;
    position: absolute;
    right: -5%;
    font-size: 2em;
  }

  @media (max-width: 639px) {
    .Modal {
      height: 100vh;
      display: flex;
      width: 100%;
      top: 0;
      left: 0;
      max-width: none;
      max-height: none;
      transition: all 0.3s ease-out;
      transform: ${props =>
        props.show ? 'translateY(0)' : 'translateY(-100vh)'};
      opacity: ${props => (props.show ? 1 : 0)};
    }
    .Logo {
      position: initial;
      margin-top: 10px;
    }
    .modal-container {
      border-radius: 0;
      justify-content: normal;
    }
    /* .auth-modes {
      position: initial;
      display: flex;
      padding: 10px;
      width: auto;
    }
    .auth-mode:last-child {
      margin-left: 10px;
      margin-top: 0;
    } */
    .auth-modes {
      margin-top: 0;
    }
    i.large.icon {
      top: 10px;
      right: 0;
    }
    i.inverted.icon {
      color: #808080;
    }
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
                  <h1 className="Logo">danni.tv</h1>

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
                    // style={{
                    //   fontSize: '3rem',
                    //   position: 'absolute',
                    //   top: '-42.5%',
                    //   left: '92.5%',
                    // }}
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

export default FullModal;
