import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from 'next/link';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import AuthForm from './AuthenticationForm';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { resetFields } from './fieldTypes';
import { RESET_PASSWORD_MUTATION } from '../../graphql/mutation';
import validateInput from './utils';

class Reset extends Component {
  state = {
    resetForm: {
      password: {
        inputConfig: {
          ...resetFields.password,
        },
        validation: {
          required: true,
        },
        modified: false,
        valid: false,
        value: '',
      },
      confirmPassword: {
        inputConfig: {
          ...resetFields.confirmPassword,
        },
        modified: false,
        validation: {
          required: true,
        },
        valid: false,
        value: '',
      },
    },
    formValid: false,
    passwordsMatch: null,
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  inputchangeHandler = (e, input) => {
    const eventValue = e.target.value;
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.resetForm,
      };
      const updatedInput = {
        ...updatedForm[input],
      };
      updatedInput.value = eventValue;
      updatedInput.valid = validateInput(
        updatedInput.value,
        updatedInput.validation
      );
      updatedInput.modified = true;
      updatedForm[input] = updatedInput;
      let formValid = true;
      for (let input in updatedForm) {
        formValid = updatedForm[input].valid && formValid;
      }
      return { resetForm: updatedForm, formValid };
    });
  };

  onSubmit = async ({ e, resetPassword, router }) => {
    const {
      resetForm: { password, confirmPassword },
    } = this.state;
    e.preventDefault();
    if (password !== confirmPassword) {
      this.setState({
        resetForm: {
          password: { ...password, value: '', valid: false, modified: false },
          confirmPassword: {
            ...confirmPassword,
            value: '',
            valid: false,
            modified: false,
          },
        },
        passwordsMatch: {
          message: 'Mật khẩu không khớp. Xin vui lòng điền lại',
        },
      });
    } else {
      this.setState({
        passwordsMatch: null,
      });
      const { data } = await resetPassword();
      if (data) {
        this.setState({
          resetForm: {
            confirmPassword: {
              ...confirmPassword,
              value: '',
              valid: false,
              modified: false,
            },
            password: {
              ...password,
              value: '',
              valid: false,
              modified: false,
            },
          },
          formValid: false,
        });
        router.push('/');
      }
    }
  };

  render() {
    const { formValid, resetForm, passwordsMatch } = this.state;
    const variables = {};
    const formElArr = [];
    for (let key in resetForm) {
      variables[key] = resetForm[key].value;
      formElArr.push({
        id: key,
        input: resetForm[key],
      });
    }

    const { router } = this.props;
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{ resetToken: router.query.resetToken, ...variables }}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}
      >
        {(resetPassword, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                this.onSubmit({ e, resetPassword, router });
              }}
            >
              <p className="auth-title">Tạo mật khẩu mới</p>
              <fieldset disabled={loading} aria-busy={loading}>
                <Error error={error} />
                <Error error={passwordsMatch} />
                {formElArr.map(({ id, input }) => (
                  <AuthForm
                    key={id}
                    value={input.value}
                    config={input.inputConfig}
                    shouldValidate={input.validation}
                    invalid={!input.valid}
                    saveToState={e => this.inputchangeHandler(e, id)}
                    touched={input.modified}
                    autoComplete="new-password"
                  />
                ))}
                <div className="center">
                  <button
                    type="submit"
                    disabled={loading || (!formValid && !passwordsMatch)}
                  >
                    Đặt mật khẩu mới
                  </button>
                </div>
              </fieldset>
              <div className="auth-links">
                <Link href="/requestReset">
                  <a>Gửi lại yêu cầu đổi mật khẩu</a>
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
