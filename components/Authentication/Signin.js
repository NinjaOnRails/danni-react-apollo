import React, { Component } from 'react';
import { Query } from 'react-apollo';
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
import { CONTENT_LANGUAGE_QUERY } from '../../graphql/query';
import { client, contentLanguageQuery } from '../UI/ContentLanguage';
import {
  onFacebookLoginClick,
  signinMutation,
  facebookLoginMutation,
} from './SigninMinimalistic';

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  facebookLoginMutation,
  signinMutation,
  contentLanguageQuery,
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
  }) => {
    e.preventDefault();
    const { data } = await signin();
    this.setState({
      email: '',
      password: '',
    });
    if (data) {
      trackSignIn(data.signin.displayName);
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
    const { noRedirect } = this.props;
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
        }) => (
          <Container>
            <Form
              method="post"
              onSubmit={e =>
                this.onSubmit({ e, signin, data, client, noRedirect })
              }
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
              <Link href="/signup">
                <a>Tạo tài khoản mới.</a>
              </Link>
              <Link href="/requestReset">
                <a>Quên mật khẩu?</a>
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
};

Signin.defaultProps = {
  noRedirect: false,
};

export default Signin;
