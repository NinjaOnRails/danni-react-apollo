import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import { Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import { trackSignIn } from '../../lib/mixpanel';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      displayName
    }
  }
`;

const FormStyles = styled.div`
  .ui.form .fields {
    margin-top: 10px;
  }
  a {
    padding-right: 1rem;
  }
`;

class Signin extends Component {
  saveToState = (e, { value }) => {
    this.setState({ [e.target.name]: value });
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
          <FormStyles>
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
                if (!noRedirectHome) Router.push('/');
                if (data) trackSignIn(data.signin.displayName);
              }}
            >
              <Error error={error} />
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  type="email"
                  name="email"
                  placeholder="email"
                  onChange={this.saveToState}
                  disabled={loading}
                />
                <Form.Input
                  fluid
                  type="password"
                  name="password"
                  placeholder="password"
                  onChange={this.saveToState}
                  disabled={loading}
                />
              </Form.Group>
              <Form.Button type="submit">Sign{loading && 'ing'} In</Form.Button>
              <Link href="/requestReset">
                <a>Forgot password?</a>
              </Link>
              <Link href="/signup">
                <a>Create a new account</a>
              </Link>
            </Form>
          </FormStyles>
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
