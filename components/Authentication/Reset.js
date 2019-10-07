import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import AuthForm from './AuthenticationForm';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { resetFields } from './fieldTypes';
import { RESET_PASSWORD_MUTATION } from '../../graphql/mutation';

class Reset extends Component {
  state = {
    confirmPassword: '',
    password: '',
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { router } = this.props;
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ resetToken: router.query.resetToken, ...this.state }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                const { data } = await resetPassword();
                if (data) {
                  this.setState({
                    confirmPassword: '',
                    password: '',
                  });
                  router.push('/');
                }
              }}
            >
              <p className="auth-title">Tạo mật khẩu mới</p>

              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                {resetFields.map(({ type, name, label }) => (
                  <div className="auth-input">
                    <input
                      type={type}
                      name={name}
                      value={this.state[name]}
                      onChange={this.saveToState}
                      data-empty={!this.state[name]}
                    />
                    <label htmlFor={name}>{label}</label>
                  </div>
                ))}
                <div className="center">
                  <button type="submit" disabled={loading}>
                    Set New Password
                  </button>
                </div>
              </fieldset>
              <div className="auth-links">
                <Link href="/requestReset">
                  <a>Resend reset password link</a>
                </Link>
              </div>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

Reset.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Reset);
