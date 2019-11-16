import { useState } from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { withRouter } from 'next/router';
import { Loader } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../UI/ErrorMessage';
import AuthForm from './AuthenticationForm';
import { resetFields } from './fieldTypes';
import { inputChangeHandler, clearForm } from './utils';
import { useResetPasswordMutation } from './authHooks';

const Reset = ({ router }) => {
  const [resetForm, setResetForm] = useState({
    ...resetFields,
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const { password, confirmPassword } = resetForm;

  const variables = {};
  const formElArr = [];
  Object.keys(resetForm).forEach(key => {
    variables[key] = resetForm[key].value;
    formElArr.push({
      id: key,
      input: resetForm[key],
    });
  });

  const [resetPassword, { error, loading }] = useResetPasswordMutation({
    resetToken: router.query.resetToken,
    variables,
  });

  const onSubmit = async e => {
    e.preventDefault();

    if (password.value !== confirmPassword.value) {
      clearForm(resetFields, setResetForm, setFormValid);
      setPasswordsMatch({
        message: 'Mật khẩu không khớp. Xin vui lòng điền lại',
      });
    } else {
      setPasswordsMatch(null);
      const { data } = await resetPassword();
      if (data) {
        setRedirecting(true);
        router.push('/');
      }
    }
  };

  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );

  return (
    <>
      <Head>
        <title key="title">Danni TV - Lập mật khẩu mới</title>
        <meta
          key="metaTitle"
          name="title"
          content="Danni TV - Lập mật khẩu mới"
        />
      </Head>
      <Form method="post" onSubmit={onSubmit}>
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
              saveToState={e =>
                inputChangeHandler(e, id, resetForm, setResetForm, setFormValid)
              }
              touched={input.modified}
              autoComplete="new-password"
            />
          ))}
          <div className="center">
            <button type="submit" disabled={loading || !formValid}>
              Xác nhận
            </button>
          </div>
        </fieldset>
        <div className="auth-links">
          <Link href="/requestReset">
            <a>Gửi lại yêu cầu đổi mật khẩu</a>
          </Link>
        </div>
      </Form>
    </>
  );
};

Reset.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(Reset);
