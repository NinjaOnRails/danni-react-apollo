import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import { Form, Segment } from 'semantic-ui-react';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { trackSignIn } from '../../lib/mixpanel';
import { SIGNIN_MUTATION } from '../../graphql/mutation';

const FormStyles = styled.div`
  a {
    padding-right: 1rem;
  }
`;

class Signin extends Component {
  saveToState = (e, { value }) => {
    this.setState({ [e.target.name]: value });
  };

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => (
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
                <Form.Button type="submit">
                  Sign{loading && 'ing'} In
                </Form.Button>
                <Link href="/requestReset">
                  <a>Forgot password?</a>
                </Link>
                <Link href="/signup">
                  <a>Create a new account</a>
                </Link>
              </Form>
            </Segment>
          </FormStyles>
        )}
      </Mutation>
    );
  }
}

export default Signin;
