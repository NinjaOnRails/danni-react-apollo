import React, { Component } from 'react';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { trackSignIn } from '../../lib/mixpanel';
import { CONTENT_LANGUAGE_QUERY } from '../UI/ContentLanguage';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      displayName
    }
  }
`;

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
  client: ({ render }) => <ApolloConsumer>{render}</ApolloConsumer>,
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

  onSubmit = async (e, signin, { previousPage }, client, noRedirect) => {
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
              onSubmit={e => this.onSubmit(e, signin, data, client, noRedirect)}
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
                <button type="submit">Sign{loading && 'ing'} In</button>
              </fieldset>
              <Link href="/requestReset">
                <a>Forgot password?</a>
              </Link>
              <Link href="/signup">
                <a>Create a new account</a>
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
export { SIGNIN_MUTATION };
