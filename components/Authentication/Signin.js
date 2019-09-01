import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Form from '../styles/Form';
import Error from '../ui/ErrorMessage';
import { CURRENT_USER_QUERY } from '../User';
import { signinFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
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
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(signin, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await signin();
                this.setState({
                  email: '',
                  password: '',
                });
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
                <button type="submit">{loading && 'Đang '}Đăng Nhập</button>
              </fieldset>
              <Link href="/requestReset">
                <a>Quên mật khẩu</a>
              </Link>
              <Link href="/signup">
                <a>Tạo tài khoản mới</a>
              </Link>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signin;
export { SIGNIN_MUTATION };
