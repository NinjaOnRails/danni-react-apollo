import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Link from 'next/link';
import { Form, Segment, Button, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import Router from 'next/router';
import Error from '../UI/ErrorMessage';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import {
  SIGNIN_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
} from '../../graphql/mutation';
import { contentLanguageQuery, client } from '../UI/ContentLanguage';

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
  client,
  facebookLoginMutation,
  signinMutation,
  contentLanguageQuery,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
});
/* eslint-enable */

const onFacebookLoginClick = ({
  facebookLogin,
  contentLanguage,
  client,
  data: { previousPage },
  closeSideDrawer = null,
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
          if (!closeSideDrawer) {
            Router.push(
              localStorage.getItem('previousPage') || previousPage || '/'
            );
            localStorage.removeItem('previousPage');
            client.writeData({ data: { previousPage: null } });
          } else {
            closeSideDrawer();
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
  saveToState = (e, { value }) => {
    this.setState({ [e.target.name]: value });
  };

  render() {
    return (
      <Composed variables={this.state}>
        {({
          client,
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
          localState: { data },
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
                  if (data) trackSignIn(data.signin.id);
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
                          client,
                          data,
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
