import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import AuthForm from './AuthenticationForm';
import { CURRENT_USER_QUERY } from './User';

import { resetFields } from './fieldTypes';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $confirmPassword: String!
    $password: String!
    $resetToken: String!
  ) {
    resetPassword(
      confirmPassword: $confirmPassword
      password: $password
      resetToken: $resetToken
    ) {
      id
      email
      displayName
    }
  }
`;

class Reset extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  state = {
    confirmPassword: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const {
      router: {
        query: { resetToken },
      },
    } = this.props;
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          resetToken,
          ...this.state,
        }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading }) => {
          return (
            <Container>
              <Form
                method="post"
                onSubmit={async e => {
                  e.preventDefault();
                  await resetPassword();
                  this.setState({
                    confirmPassword: '',
                    password: '',
                  });
                }}
              >
                <fieldset disabled={loading} aria-busy={loading}>
                  <Error error={error} />
                  {resetFields.map(form => (
                    <AuthForm
                      key={form.name}
                      form={form}
                      saveToState={this.saveToState}
                      value={this.state}
                    />
                  ))}
                  <button type="submit">Set New Password</button>
                </fieldset>
                <Link href="/requestReset">
                  <a>Resend reset password link</a>
                </Link>
              </Form>
            </Container>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(Reset);
export { RESET_PASSWORD_MUTATION };
