import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Link from 'next/link';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

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

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { name, email, password, displayName } = this.state;
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
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                <label htmlFor="email">
                  E-mail
                  <input
                    type="email"
                    name="email"
                    placeholder="bắt buộc"
                    value={email}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="name">
                  Họ và tên
                  <input
                    type="name"
                    name="name"
                    value={name}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="displayName">
                  Tên hiển thị
                  <input
                    type="displayName"
                    name="displayName"
                    value={displayName}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  Mật khẩu
                  <input
                    type="password"
                    name="password"
                    placeholder="bắt buộc"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Tạo Tài Khoản Mới</button>
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
