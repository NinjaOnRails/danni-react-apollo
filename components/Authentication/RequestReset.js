import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import { signupFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { error, loading, called }) => {
          return (
            <Container>
              <Form
                method="post"
                onSubmit={async e => {
                  e.preventDefault();
                  await requestReset();
                  this.setState({
                    email: '',
                  });
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  {!error && !loading && called && (
                    <p>Please check your email for reset link.</p>
                  )}
                  <h2>Password Reset Request</h2>
                  <AuthForm
                    form={signupFields[0]}
                    saveToState={this.saveToState}
                    value={this.state}
                  />

                  <button type="submit">Send</button>
                </fieldset>
              </Form>
            </Container>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
export { REQUEST_RESET_MUTATION };
