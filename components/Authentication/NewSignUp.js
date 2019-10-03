import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import generateName from 'sillyname';
import { Container, Button, Icon } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import { SIGNUP_MUTATION } from '../../graphql/mutation';
import { client } from '../UI/ContentLanguage';
import {
  onFacebookLoginClick,
  facebookLoginMutation,
  closeAuthModal,
} from './Signin';
import StyledForm from '../styles/NewForm';

/* eslint-disable */
const signupMutation = ({ localState: { data }, variables, render }) => (
  <Mutation
    mutation={SIGNUP_MUTATION}
    variables={{
      ...variables,
      contentLanguage: data ? data.contentLanguage : [],
    }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signup, signupResult) => {
      return render({ signup, signupResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  signupMutation,
  closeAuthModal,
  facebookLoginMutation,
});

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    displayName: '',
  };

  componentDidMount() {
    this.setState({ displayName: generateName() });
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async ({ e, signup, previousPage, client, closeAuthModal }) => {
    e.preventDefault();
    const { data } = await signup();
    this.setState({
      name: '',
      email: '',
      password: '',
      displayName: '',
    });
    if (data) {
      trackSignUp(data.signup);
      Router.push(localStorage.getItem('previousPage') || previousPage || '/');
      localStorage.removeItem('previousPage');
      client.writeData({ data: { previousPage: null } });
      closeAuthModal();
    }
  };

  render() {
    return (
      <Composed variables={this.state}>
        {({
          client,
          localState: { data },
          signupMutation: {
            signup,
            signupResult: { error, loading },
          },
          closeAuthModal,
          facebookLoginMutation: {
            facebookLogin,
            facebookLoginResult: {
              error: fbLoginError,
              loading: fbLoginLoading,
            },
          },
        }) => {
          const { modal } = this.props;
          return (
            <StyledForm
              method="post"
              onSubmit={async e =>
                this.onSubmit({
                  e,
                  signup,
                  previousPage: data.previousPage,
                  client,
                  closeAuthModal,
                })
              }
              modal={modal}
            >
              <p className="auth-title">Tạo tài khoản miễn phí</p>

              <fieldset
                disabled={loading || fbLoginLoading}
                aria-busy={loading || fbLoginLoading}
              >
                <Error error={error} />
                <Error error={fbLoginError} />
                {signupFields.map(({ name, type, label }) => (
                  <div className="auth-input" key={name}>
                    <input
                      type={type}
                      // placeholder={placeholder}
                      name={name}
                      value={this.state[name]}
                      onChange={this.saveToState}
                      data-empty={!this.state[name]}
                      autoComplete="new-password"
                    />
                    <label htmlFor={name}>{label}</label>
                  </div>
                ))}

                <div className="center">
                  <button type="submit">
                    {(loading || fbLoginLoading) && 'Đang '}Đăng Ký
                  </button>
                  <Button
                    size="big"
                    type="button"
                    color="facebook"
                    onClick={() =>
                      onFacebookLoginClick({
                        facebookLogin,
                        contentLanguage: data.contentLanguage,
                        client,
                        data,
                        closeAuthModal: modal && closeAuthModal,
                      })
                    }
                  >
                    <Icon name="facebook" /> Dùng Facebook
                  </Button>
                </div>
                {/* <button type="submit">Sign{loading && 'ing'} Up</button> */}
              </fieldset>
              <div className="auth-links">
                {!modal && (
                  <>
                    <Link href="/signin">
                      <a>Đã có tài khoản?</a>
                    </Link>
                    <Link href="/requestReset">
                      <a>
                        <span role="link" tabIndex={0} onClick={closeAuthModal}>
                          Quên mật khẩu?
                        </span>
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </StyledForm>
          );
        }}
      </Composed>
    );
  }
}

Signup.propTypes = {
  modal: PropTypes.bool,
};

Signup.defaultProps = {
  modal: false,
};

export default Signup;
