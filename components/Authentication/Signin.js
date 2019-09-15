import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import { Container } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { trackSignIn } from '../../lib/mixpanel';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      displayName
    }
  }
`;

class Signin extends Component {
  state = {
    email: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { noRedirectHome } = this.props;
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
          <Container>
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const { data } = await signin();
                this.setState({
                  email: '',
                  password: '',
                });
                if (!noRedirectHome) Router.push('/');
                if (data) trackSignIn(data.signin.displayName);
              }}
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
      </Mutation>
    );
  }
}

Signin.propTypes = {
  noRedirectHome: PropTypes.bool,
};

Signin.defaultProps = {
  noRedirectHome: false,
};

export default Signin;
export { SIGNIN_MUTATION };
