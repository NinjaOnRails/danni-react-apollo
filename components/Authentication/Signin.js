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
import { trackSignIn } from '../../lib/mixpanel';
import { client, contentLanguageQuery } from '../UI/ContentLanguage';
import { CONTENT_LANGUAGE_QUERY } from '../../graphql/query';
import { CLOSE_AUTH_MODAL_MUTATION } from '../../graphql/mutation';
import {
  onFacebookLoginClick,
  signinMutation,
  facebookLoginMutation,
} from './SigninMinimalistic';

/* eslint-disable */
const closeAuthModal = ({ render }) => (
  <Mutation mutation={CLOSE_AUTH_MODAL_MUTATION}>{render}</Mutation>
);

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
    const { noRedirect, isModal } = this.props;
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
              isModal={isModal}
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
                    })
                  }
                >
                  <Icon name="facebook" /> Dùng Facebook
                </Button>
                {/* <button type="submit">Sign{loading && 'ing'} In</button> */}
              </fieldset>
              {!isModal && (
                  <Link href="/signup">
                    <a>Tạo tài khoản mới.</a>
                  </Link>
                )}
              <Link href="/requestReset">
                <a>
                  <span onClick={closeAuthModal}>Quên mật khẩu?</span>
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
  isModal: PropTypes.bool,
};

Signin.defaultProps = {
  noRedirect: false,
  isModal: false,
};

export default Signin;
