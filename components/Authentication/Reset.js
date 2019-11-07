import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Loader } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import AuthForm from './AuthenticationForm';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import { resetFields } from './fieldTypes';
import { RESET_PASSWORD_MUTATION } from '../../graphql/mutation';
import {validateInput} from './utils';

const Reset = ({ router }) => {
  const [resetForm, setResetForm] = useState({
    password: {
      inputConfig: {
        ...resetFields.password,
      },
      validation: {
        required: true,
        minLength: 6,
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
        minLength: 6,
      },
      valid: false,
      value: '',
    },
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const inputChangeHandler = (e, input) => {
    const eventValue = e.target.value;
    const updatedForm = {
      ...resetForm,
    };
    const updatedElement = {
      ...updatedForm[input],
    };
    updatedElement.value = eventValue;
    updatedElement.valid = validateInput(
      updatedElement.value,
      updatedElement.validation
    );
    updatedElement.modified = true;
    updatedForm[input] = updatedElement;
    let isFormValid = true;
    Object.keys(updatedForm).forEach(key => {
      isFormValid = updatedForm[key].valid && isFormValid;
    });
    setResetForm(updatedForm);
    setFormValid(isFormValid);
  };

  const onSubmit = async ({ e, resetPassword, router }) => {
    const { password, confirmPassword } = resetForm;

    e.preventDefault();
    setPasswordsMatch(null);

    if (password.value !== confirmPassword.value) {
      setResetForm({
        password: {
          ...resetForm.password,
          value: '',
          valid: false,
        },
        confirmPassword: {
          ...resetForm.confirmPassword,
          value: '',
          valid: false,
        },
      });
      setPasswordsMatch({
        message: 'Mật khẩu không khớp. Xin vui lòng điền lại',
      });
      setFormValid(false);
    } else {
      setPasswordsMatch(null);
      const { data } = await resetPassword();
      if (data) {
        setResetForm({
          pasword: {
            ...resetForm.password,
            value: '',
            valid: false,
            modified: false,
          },
          confirmPassword: {
            ...resetForm.confirmPassword,
            value: '',
            valid: false,
            modified: false,
          },
        });
        setFormValid(false);
        setRedirecting(true);

        router.push('/');
      }
    }
  };

  const variables = {};
  const formElArr = [];
  Object.keys(resetForm).forEach(key => {
    variables[key] = resetForm[key].value;
    formElArr.push({
      id: key,
      input: resetForm[key],
    });
  });

  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );

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
              onSubmit({ e, resetPassword, router });
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
                  saveToState={e => inputChangeHandler(e, id)}
                  touched={input.modified}
                  autoComplete="new-password"
                />
              ))}
              <div className="center">
                <button type="submit" disabled={loading}>
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
};

Reset.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Reset);
