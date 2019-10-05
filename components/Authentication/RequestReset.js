import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import { signupFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { REQUEST_RESET_MUTATION } from '../../graphql/mutation';

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
              <fieldset
                disabled={loading}
                aria-busy={loading}
                style={{ marginTop: '10px', textAlign: 'center' }}
              >
                {!error && !loading && called && (
                  <p>Hãy kiểm tra e-mail của bạn để tiếp tục.</p>
                )}
                <h2>Yêu cầu đổi mật khẩu</h2>
                <div className="auth-input">
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    onChange={this.saveToState}
                    data-empty={this.state.email}
                  />
                  <label htmlFor="email">E-mail</label>
                </div>
                <div className="center">
                  <button type="submit">Gửi</button>
                </div>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
