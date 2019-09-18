import React, { Component } from 'react';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import generateName from 'sillyname';
import { Container } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import AuthForm from './AuthenticationForm';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import { CONTENT_LANGUAGE_QUERY } from '../UI/ContentLanguage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String
    $displayName: String
    $email: String!
    $password: String!
    $contentLanguage: [Language]
  ) {
    signup(
      data: {
        name: $name
        email: $email
        password: $password
        contentLanguage: $contentLanguage
        displayName: $displayName
      }
    ) {
      id
      name
      email
      displayName
    }
  }
`;

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
  client: ({ render }) => <ApolloConsumer>{render}</ApolloConsumer>,
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

  onSubmit = async (e, signup, previousPage, client) => {
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
                  this.onSubmit(e, signup, data.previousPage, client)
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
                  <button type="submit">Sign{loading && 'ing'} Up</button>
                </fieldset>
                <Link href="/signin">
                  <a>Already have an account?</a>
                </Link>
                <Link href="/requestReset">
                  <a>Forgot password?</a>
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
export { SIGNUP_MUTATION };
