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
            <Container>
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
                    <p>Hãy kiểm tra e-mail của bạn để tiếp tục.</p>
                  )}
                  <h2>Yêu cầu đổi mật khẩu</h2>
                  <AuthForm
                    form={signupFields[0]}
                    saveToState={this.saveToState}
                    value={this.state}
                  />

                  <button type="submit">Gửi</button>
                </fieldset>
              </Form>
            </Container>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
