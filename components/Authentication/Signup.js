import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Router from 'next/router';
import generateName from 'sillyname';
import Form from '../styles/Form';
import Error from '../ui/ErrorMessage';
import { CURRENT_USER_QUERY } from './User';
import AuthForm from './AuthenticationForm';
import { signupFields } from './fieldTypes';

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
      email
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
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await signup();
                this.setState({
                  name: '',
                  email: '',
                  password: '',
                  displayName: '',
                });
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
                <button type="submit">
                  {loading && 'Đang '}Tạo Tài Khoản Mới
                </button>
              </fieldset>
              <Link href="/signin">
                <a>Đã có tài khoản</a>
              </Link>
              <Link href="/requestReset">
                <a>Quên mật khẩu</a>
              </Link>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
export { SIGNUP_MUTATION };
