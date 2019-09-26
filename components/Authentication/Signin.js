import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { trackSignIn } from '../../lib/mixpanel';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import { SIGNIN_MUTATION } from '../../graphql/mutation';
import { client } from '../UI/ContentLanguage';

/* eslint-disable */
const signinMutation = ({ variables, render }) => (
  <Mutation
    mutation={SIGNIN_MUTATION}
    variables={variables}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signin, signinResult) => {
      return render({ signin, signinResult });
    }}
  </Mutation>
);

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  signinMutation,
});
/* eslint-enable */

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
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                {signinFields.map(form => (
                  <AuthForm
                    key={form.name}
                    form={form}
                    saveToState={this.saveToState}
                    value={this.state}
                  />
                ))}
                <button type="submit">{loading && 'Đang '}Đăng Nhập</button>
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
