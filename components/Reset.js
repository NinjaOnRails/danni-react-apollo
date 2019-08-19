import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

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
    const { confirmPassword, password } = this.state;
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
                <label htmlFor="password">
                  Mật khẩu mới
                  <input
                    type="password"
                    name="password"
                    placeholder="bắt buộc"
                    value={password}
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="confirmPassword">
                  Lặp lại mặt khẩu mới
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="bắt buộc"
                    value={confirmPassword}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Đặt Mật Khẩu</button>
              </fieldset>
              <Link href="/requestReset">
                <a>Gửi yêu cầu mới vào email</a>
              </Link>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default withRouter(Reset);
export { RESET_PASSWORD_MUTATION };
