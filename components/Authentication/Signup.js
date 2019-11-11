import React, { useState, useEffect } from 'react';
import { ApolloConsumer } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import generateName from 'sillyname';
import { Button, Icon, Loader } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { inputChangeHandler, clearForm, onFacebookLoginClick } from './utils';
import {
  useCloseAuthModalMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
  useSignupMutation,
} from './AuthHooks';

const Signup = ({ modal }) => {
  const [signupForm, setSignupForm] = useState({
    ...signupFields,
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [displayPassword, setdisplayPassword] = useState(false);

  const variables = {};
  const formElArr = [];
  Object.keys(signupForm).forEach(key => {
    variables[key] = signupForm[key].value;
    formElArr.push({
      id: key,
      input: signupForm[key],
    });
  });

  const {
    facebookLogin,
    data: { error: fbLoginError, loading: fbLoginLoading },
  } = useFacebookLoginMutation();
  const { closeAuthModal } = useCloseAuthModalMutation();
  const { contentLanguage, previousPage } = useLocalStateQuery();
  const {
    signup,
    data: { error, loading },
  } = useSignupMutation(contentLanguage, variables);

  useEffect(() => {
    const { displayName } = signupForm;
    setSignupForm({
      ...signupForm,
      displayName: { ...displayName, value: generateName(), valid: true },
    });
  }, []);

  const onSubmit = async ({ e, client }) => {
    e.preventDefault();
    const { data } = await signup();
    if (data) {
      clearForm(
        {
          ...signupFields,
          displayName: {
            ...signupFields.displayName,
            value: generateName(),
            valid: true,
          },
        },
        setSignupForm,
        setFormValid
      );

      trackSignUp(data.signup);
      if (modal) {
        closeAuthModal();
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
      {client => {
        return (
          <StyledForm
            method="post"
            onSubmit={e =>
              onSubmit({
                e,
                client,
              })
            }
            modal={modal}
          >
            <p className="auth-title">Tạo tài khoản miễn phí</p>

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
                      signupForm,
                      setSignupForm,
                      setFormValid
                    )
                  }
                  touched={input.modified}
                  autoComplete="new-password"
                  displayPassword={displayPassword}
                  onShowPasswordToggle={() =>
                    setdisplayPassword(!displayPassword)
                  }
                />
              ))}
              <div className="center">
                <button type="submit" disabled={loading || fbLoginLoading}>
                  {(loading || fbLoginLoading) && 'Đang '}Đăng Ký
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
              {!modal && (
                <div className="auth-links">
                  <Link href="/signin">
                    <a>Đã có tài khoản</a>
                  </Link>
                  <Link href="/requestReset">
                    <a>
                      <span role="link" tabIndex={0} onClick={closeAuthModal}>
                        Quên mật khẩu
                      </span>
                    </a>
                  </Link>
                </div>
              )}
              {/* <button type="submit">Sign{loading && 'ing'} Up</button> */}
            </fieldset>
          </StyledForm>
        );
      }}
    </ApolloConsumer>
  );
};

Signup.propTypes = {
  modal: PropTypes.bool,
};

Signup.defaultProps = {
  modal: false,
};

export default Signup;
