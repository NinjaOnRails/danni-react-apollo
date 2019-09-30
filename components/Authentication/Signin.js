import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Container, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
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
            trackSignIn(user.displayName);
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
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = async ({
    e,
    signin,
    data: { previousPage },
    client,
    noRedirect,
    closeAuthModal,
  }) => {
    e.preventDefault();
    const { data } = await signin();
    this.setState({
      email: '',
      password: '',
    });
    if (data) {
      trackSignIn(data.signin.displayName);
      closeAuthModal();
      if (!noRedirect) {
        Router.push(
          localStorage.getItem('previousPage') || previousPage || '/'
        );
        localStorage.removeItem('previousPage');
        client.writeData({ data: { previousPage: null } });
      }
    }
  };

  render() {
    const { noRedirect, modal } = this.props;
    return (
      <Composed variables={this.state}>
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
          <Container>
            <Form
              method="post"
              onSubmit={e =>
                this.onSubmit({
                  e,
                  signin,
                  data,
                  client,
                  noRedirect,
                  closeAuthModal,
                })
              }
              modal
            >
              <fieldset
                disabled={loading || fbLoginLoading}
                aria-busy={loading || fbLoginLoading}
              >
                <Error error={error} />
                <Error error={fbLoginError} />
                {signinFields.map(form => (
                  <AuthForm
                    key={form.name}
                    form={form}
                    saveToState={this.saveToState}
                    value={this.state}
                  />
                ))}
                <button type="submit">
                  {(loading || fbLoginLoading) && 'Đang '}Đăng Nhập
                </button>
                <Button
                  size="big"
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
                  <Icon name="facebook" /> Dùng Facebook
                </Button>
                {/* <button type="submit">Sign{loading && 'ing'} In</button> */}
              </fieldset>
              {!modal && (
                <Link href="/signup">
                  <a>Tạo tài khoản mới.</a>
                </Link>
              )}
              <Link href="/requestReset">
                <a>
                  <span role="link" tabIndex={0} onClick={closeAuthModal}>
                    Quên mật khẩu?
                  </span>
                </a>
              </Link>
            </Form>
          </Container>
        )}
      </Composed>
    );
  }
}

Signin.propTypes = {
  noRedirect: PropTypes.bool,
  modal: PropTypes.bool,
};

Signin.defaultProps = {
  noRedirect: false,
  modal: false,
};

export default Signin;
export {
  onFacebookLoginClick,
  facebookLoginMutation,
  signinMutation,
  closeAuthModal,
};
