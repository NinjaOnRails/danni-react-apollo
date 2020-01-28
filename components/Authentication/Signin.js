import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Icon, Loader, Header } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Head from 'next/head';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import { client, contentLanguageQuery } from '../UI/ContentLanguage';
import {
  CONTENT_LANGUAGE_QUERY,
  CURRENT_USER_QUERY,
} from '../../graphql/query';
import {
  CLOSE_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  SIGNIN_MUTATION,
} from '../../graphql/mutation';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { validateInput } from './utils';

/* eslint-disable */
const signinMutation = ({ render, variables }) => (
  <Mutation
    mutation={SIGNIN_MUTATION}
    variables={variables}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signin, signinResult) => render({ signin, signinResult })}
  </Mutation>
);

const facebookLoginMutation = ({ render }) => (
  <Mutation
    mutation={FACEBOOK_LOGIN_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(facebookLogin, facebookLoginResult) =>
      render({ facebookLogin, facebookLoginResult })
    }
  </Mutation>
);

const closeAuthModal = ({ render }) => (
  <Mutation mutation={CLOSE_AUTH_MODAL_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  facebookLoginMutation,
  contentLanguageQuery,
  signinMutation,
  closeAuthModal,
});

const onFacebookLoginClick = ({
  facebookLogin,
  contentLanguage,
  client,
  data: { previousPage },
  closeSideDrawer = null,
  closeAuthModal = null,
}) => {
  FB.login(
    async res => {
      if (res.status === 'connected') {
        const {
          authResponse: { accessToken, userID },
        } = res;
        const { data } = await facebookLogin({
          variables: {
            contentLanguage,
            accessToken,
            facebookUserId: userID,
          },
        });
        if (data) {
          const {
            facebookLogin: { user, firstLogin },
          } = data;
          if (firstLogin) {
            trackSignUp(user);
          } else {
            trackSignIn(user.id);
          }
          if (closeSideDrawer) {
            closeSideDrawer();
          } else if (closeAuthModal) {
            closeAuthModal();
          } else {
            Router.push(
              localStorage.getItem('previousPage') || previousPage || '/'
            );
            localStorage.removeItem('previousPage');
            client.writeData({ data: { previousPage: null } });
          }
        }
      }
    },
    {
      scope: 'public_profile',
    }
  );
};

class Signin extends Component {
  state = {
    redirecting: false,
    signinForm: {
      email: {
        inputConfig: {
          ...signinFields.email,
        },
        validation: {
          required: true,
          isEmail: true,
        },
        modified: false,
        valid: false,
        value: '',
      },
      password: {
        inputConfig: {
          ...signinFields.password,
        },
        validation: {
          required: true,
        },
        modified: false,
        valid: false,
        value: '',
      },
    },
    formValid: false,
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  inputchangeHandler = (e, input) => {
    const eventValue = e.target.value;
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.signinForm,
      };
      const updatedInput = {
        ...updatedForm[input],
      };
      updatedInput.value = eventValue;
      updatedInput.valid = validateInput(
        updatedInput.value,
        updatedInput.validation
      );
      updatedInput.modified = true;
      updatedForm[input] = updatedInput;
      let formValid = true;
      Object.keys(updatedForm).forEach(key => {
        formValid = updatedForm[key].valid && formValid;
      });
      return { signinForm: updatedForm, formValid };
    });
  };

  onSubmit = async ({
    e,
    signin,
    data: { previousPage },
    client,
    closeAuthModal,
  }) => {
    const {
      signinForm: { password, email },
    } = this.state;
    e.preventDefault();
    const { data } = await signin();
    if (data) {
      this.setState({
        signinForm: {
          email: { ...email, value: '', valid: false, modified: false },
          password: { ...password, value: '', valid: false, modified: false },
        },
      });
      trackSignIn(data.signin.id);
      if (this.props.modal) {
        closeAuthModal();
      } else {
        this.setState({ redirecting: true });
        Router.push(
          localStorage.getItem('previousPage') || previousPage || '/'
        );
        localStorage.removeItem('previousPage');
        client.writeData({ data: { previousPage: null } });
      }
    }
  };

  render() {
    const { modal } = this.props;
    const { formValid, signinForm, redirecting } = this.state;
    const variables = {};
    const formElArr = [];
    Object.keys(signinForm).forEach(key => {
      variables[key] = signinForm[key].value;
      formElArr.push({
        id: key,
        input: signinForm[key],
      });
    });
    if (redirecting)
      return (
        <Loader indeterminate active>
          Đang chuyển trang...
        </Loader>
      );
    return (
      <Composed variables={variables}>
        {({
          client,
          localState: { data },
          facebookLoginMutation: {
            facebookLogin,
            facebookLoginResult: {
              error: fbLoginError,
              loading: fbLoginLoading,
            },
          },
          contentLanguageQuery: { contentLanguage },
          signinMutation: {
            signin,
            signinResult: { error, loading },
          },
          closeAuthModal,
        }) => (
          <>
            <Head>
              <title key="title">Danni TV - Đăng nhập</title>
              <meta
                key="metaTitle"
                name="title"
                content="Danni TV - Đăng nhập"
              />
            </Head>
            <StyledForm
              method="post"
              onSubmit={e =>
                this.onSubmit({
                  e,
                  signin,
                  data,
                  client,
                  closeAuthModal,
                })
              }
              modal={modal}
            >
              <Header as="h1" textAlign="center">
                Đăng nhập {modal && 'để tiếp tục'}
              </Header>
              <fieldset
                disabled={loading || fbLoginLoading}
                aria-busy={loading || fbLoginLoading}
              >
                <Error error={error} />
                <Error error={fbLoginError} />
                {formElArr.map(({ id, input }) => (
                  <AuthForm
                    key={id}
                    value={input.value}
                    config={input.inputConfig}
                    shouldValidate={input.validation}
                    invalid={!input.valid}
                    saveToState={e => this.inputchangeHandler(e, id)}
                    touched={input.modified}
                  />
                ))}
                <div className="center">
                  <button type="submit" disabled={loading || fbLoginLoading}>
                    {(loading || fbLoginLoading) && 'Đang '}Đăng Nhập
                  </button>
                  <p className="or">hoặc dùng</p>
                  <Button
                    type="button"
                    color="facebook"
                    onClick={() =>
                      onFacebookLoginClick({
                        facebookLogin,
                        contentLanguage,
                        client,
                        data,
                        closeAuthModal: modal && closeAuthModal,
                      })
                    }
                  >
                    <Icon name="facebook" />
                    Facebook
                  </Button>
                </div>
                <div className="auth-links">
                  {!modal && (
                    <Link href="/signup">
                      <a>Tạo tài khoản mới</a>
                    </Link>
                  )}
                  <Link href="/requestReset">
                    <a>
                      <span role="link" tabIndex={0} onClick={closeAuthModal}>
                        Quên mật khẩu?
                      </span>
                    </a>
                  </Link>
                </div>
              </fieldset>
            </StyledForm>
          </>
        )}
      </Composed>
    );
  }
}

Signin.propTypes = {
  modal: PropTypes.bool,
};

Signin.defaultProps = {
  modal: false,
};

export default Signin;
export {
  onFacebookLoginClick,
  facebookLoginMutation,
  signinMutation,
  closeAuthModal,
};
