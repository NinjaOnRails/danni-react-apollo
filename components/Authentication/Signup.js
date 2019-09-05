import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import generateName from 'sillyname';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import AuthForm from './AuthenticationForm';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String
    $displayName: String
    $email: String!
    $password: String!
  ) {
    signup(
      data: {
        name: $name
        email: $email
        password: $password
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

  render() {
    return (
      <Mutation
        mutation={SIGNUP_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signup, { error, loading }) => {
          return (
            <Container>
              <Form
                method="post"
                onSubmit={async e => {
                  e.preventDefault();
                  const {
                    data: { signup: signUpData },
                  } = await signup();
                  this.setState({
                    name: '',
                    email: '',
                    password: '',
                    displayName: '',
                  });
                  if (signUpData) trackSignUp(signUpData);
                  Router.push('/');
                }}
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
      </Mutation>
    );
  }
}

export default Signup;
export { SIGNUP_MUTATION };
