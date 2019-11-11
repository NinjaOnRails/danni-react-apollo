import React, { useState } from 'react';
import { ApolloConsumer } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Icon, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import { trackSignIn } from '../../lib/mixpanel';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { inputChangeHandler, clearForm, onFacebookLoginClick } from './utils';
import {
  useCloseAuthModalMutation,
  useSigninMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
} from './AuthHooks';

const Signin = ({ modal }) => {
  const [signinForm, setSigninForm] = useState({
    ...signinFields,
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const { contentLanguage, previousPage } = useLocalStateQuery();
  const {
    signin,
    data: { error, loading },
  } = useSigninMutation();

  const { closeAuthModal } = useCloseAuthModalMutation();

  const {
    facebookLogin,
    data: { error: fbLoginError, loading: fbLoginLoading },
  } = useFacebookLoginMutation();

  const variables = {};
  const formElArr = [];
  Object.keys(signinForm).forEach(key => {
    variables[key] = signinForm[key].value;
    formElArr.push({
      id: key,
      input: signinForm[key],
    });
  });

  const onSubmit = async ({
    e,
    signin: signinMutation,
    previousPage,
    client,
    closeAuthModal: closeAuthModalMutation,
  }) => {
    e.preventDefault();
    const { data } = await signinMutation({
      variables: { ...variables },
    });
    if (data) {
      clearForm(signinFields, setSigninForm, setFormValid);
      trackSignIn(data.signin.id);
      if (modal) {
        closeAuthModalMutation();
      } else {
        setRedirecting(true);
        Router.push(
          localStorage.getItem('previousPage') || previousPage || '/'
        );
        localStorage.removeItem('previousPage');
        client.writeData({ data: { previousPage: null } });
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
    <ApolloConsumer>
      {client => (
        <StyledForm
          method="post"
          onSubmit={e =>
            onSubmit({
              e,
              signin,
              previousPage,
              client,
              closeAuthModal,
            })
          }
          modal={modal}
        >
          <p className="auth-title">Đăng nhập {modal && 'để tiếp tục'}</p>
          <fieldset
            disabled={loading || fbLoginLoading}
            aria-busy={loading || fbLoginLoading}
          >
            <Error error={error} />
            <Error error={fbLoginError} />
            {formElArr.map(({ id, input }) => (
              <AuthForm
                key={id}
                value={input.value}
                config={input.inputConfig}
                shouldValidate={input.validation}
                invalid={!input.valid}
                saveToState={e =>
                  inputChangeHandler(
                    e,
                    id,
                    signinForm,
                    setSigninForm,
                    setFormValid
                  )
                }
                touched={input.modified}
              />
            ))}
            <div className="center">
              <button type="submit" disabled={loading || fbLoginLoading}>
                {(loading || fbLoginLoading) && 'Đang '}Đăng Nhập
              </button>
              <p className="or">hoặc dùng</p>
              <Button
                type="button"
                color="facebook"
                onClick={() =>
                  onFacebookLoginClick({
                    facebookLogin,
                    contentLanguage,
                    client,
                    previousPage,
                    closeAuthModal: modal && closeAuthModal,
                  })
                }
              >
                <Icon name="facebook" />
                Facebook
              </Button>
            </div>
            <div className="auth-links">
              {!modal && (
                <Link href="/signup">
                  <a>Tạo tài khoản mới</a>
                </Link>
              )}
              <Link href="/requestReset">
                <a>
                  <span role="link" tabIndex={0} onClick={closeAuthModal}>
                    Quên mật khẩu?
                  </span>
                </a>
              </Link>
            </div>
          </fieldset>
        </StyledForm>
      )}
    </ApolloConsumer>
  );
};

Signin.propTypes = {
  modal: PropTypes.bool,
};

Signin.defaultProps = {
  modal: false,
};

export default Signin;
