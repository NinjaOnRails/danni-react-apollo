import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import { Form, Segment, Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { trackSignIn } from '../../lib/mixpanel';
import {
  SIGNIN_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
} from '../../graphql/mutation';
import { contentLanguageQuery } from '../UI/ContentLanguage';

const FormStyles = styled.div`
  .signin-options {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-content: space-between;
  }
`;
/* eslint-disable */

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

const signinMutation = ({ render, variables }) => (
  <Mutation
    mutation={SIGNIN_MUTATION}
    variables={variables}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signin, signinResult) => render({ signin, signinResult })}
  </Mutation>
);

const Composed = adopt({
  facebookLoginMutation,
  signinMutation,
  contentLanguageQuery,
});
/* eslint-enable */

const onFacebookLoginClick = ({ facebookLogin, contentLanguage }) => {
  FB.login(
    async res => {
      const success = res.status === 'connected';
      if (success) {
        const { data } = await facebookLogin({
          variables: {
            contentLanguage,
            accessToken: res.authResponse.accessToken,
          },
        });
        if (data) trackSignIn(data.facebookLogin.displayName);
      }
    },
    {
      scope: 'public_profile',
    }
  );
};

class Signin extends Component {
  saveToState = (e, { value }) => {
    this.setState({ [e.target.name]: value });
  };

  render() {
    return (
      <Composed variables={this.state}>
        {({
          facebookLoginMutation: {
            facebookLogin,
            facebookLoginResult: {
              error: fbLoginError,
              loading: fbLoginLoading,
            },
          },
          signinMutation: {
            signin,
            signinResult: { error, loading },
          },
          contentLanguageQuery: { contentLanguage },
        }) => (
          <FormStyles>
            <Segment>
              <Form
                method="post"
                onSubmit={async e => {
                  e.preventDefault();
                  const { data } = await signin();
                  if (data)
                    this.setState({
                      email: '',
                      password: '',
                    });
                  if (data) trackSignIn(data.signin.displayName);
                }}
              >
                <Error error={error} />
                <Error error={fbLoginError} />
                <Form.Group widths="equal">
                  <Form.Input
                    fluid
                    type="email"
                    name="email"
                    placeholder="email"
                    onChange={this.saveToState}
                    disabled={loading || fbLoginLoading}
                  />
                  <Form.Input
                    fluid
                    type="password"
                    name="password"
                    placeholder="mật khẩu"
                    onChange={this.saveToState}
                    disabled={loading || fbLoginLoading}
                  />
                </Form.Group>
                <div className="signin-options">
                  <div className="signin-buttons">
                    <Button primary>
                      {(loading || fbLoginLoading) && 'Đang '}Đăng Nhập
                    </Button>
                    <Button
                      type="button"
                      color="facebook"
                      onClick={() =>
                        onFacebookLoginClick({
                          facebookLogin,
                          contentLanguage,
                        })
                      }
                    >
                      <Icon name="facebook" /> Dùng Facebook
                    </Button>
                  </div>
                  <div className="signin-other">
                    <Link href="/signup">
                      <a>Tạo tài khoản mới. </a>
                    </Link>
                    <Link href="/requestReset">
                      <a>Quên mật khẩu?</a>
                    </Link>
                  </div>
                </div>
              </Form>
            </Segment>
          </FormStyles>
        )}
      </Composed>
    );
  }
}

export default Signin;
export { onFacebookLoginClick, facebookLoginMutation, signinMutation };
