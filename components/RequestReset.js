import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';

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
    const { email } = this.state;
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(requestReset, { error, loading, called }) => {
          return (
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
                  <p>Hãy vào email của bạn để tiếp tục.</p>
                )}
                <h2>Yêu Cầu Đổi Mật Khẩu</h2>
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
                <button type="submit">Gửi vào email</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
export { REQUEST_RESET_MUTATION };
