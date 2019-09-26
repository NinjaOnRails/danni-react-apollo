import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import generateName from 'sillyname';
import { Container } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import AuthForm from './AuthenticationForm';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import { SIGNUP_MUTATION } from '../../graphql/mutation';
import { client } from '../UI/ContentLanguage';

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

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  signupMutation,
});
/* eslint-enable */

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

  onSubmit = async ({ e, signup, previousPage, client }) => {
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
        }) => {
          return (
            <Container>
              <Form
                method="post"
                onSubmit={async e =>
                  this.onSubmit({
                    e,
                    signup,
                    previousPage: data.previousPage,
                    client,
                  })
                }
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <Error error={error} />
                  {signupFields.map(form => (
                    <AuthForm
                      key={form.name}
                      form={form}
                      saveToState={this.saveToState}
                      value={this.state}
                    />
                  ))}
                  <button type="submit">{loading && 'Đang '}Đăng Nhập</button>
                  {/* <button type="submit">Sign{loading && 'ing'} Up</button> */}
                </fieldset>
                <Link href="/signin">
                  <a>Đã có tài khoản? Đăng nhập.</a>
                </Link>
                <Link href="/requestReset">
                  <a>Quên mật khẩu?</a>
                </Link>
              </Form>
            </Container>
          );
        }}
      </Composed>
    );
  }
}

export default Signup;
