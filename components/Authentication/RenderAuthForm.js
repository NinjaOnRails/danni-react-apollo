import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';

import { Button, Icon, Header } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import { CURRENT_USER_QUERY } from '../../graphql/query';

const RenderAuthForm = ({ defaultForm }) => {
  const [authForm, setAuthForm] = useState({
    ...defaultForm,
  });
  const [redirecting, setRedirecting] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const variables = {};
  const formElArr = [];
  Object.keys(defaultForm).forEach(key => {
    variables[key] = defaultForm[key].value;
    formElArr.push({
      id: key,
      input: defaultForm[key],
    });
  });

  const validateInput = (value, rule) => {
    let isValid = true;
    if (!rule) {
      return true;
    }
    if (rule.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rule.minLength) {
      isValid = value.length >= rule.minLength && isValid;
    }
    if (rule.maxLength) {
      isValid = value.length <= rule.maxLength && isValid;
    }
    if (rule.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  };

  const inputChangeHandler = (e, input) => {
    const eventValue = e.target.value;
    const updatedForm = {
      ...authForm,
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
    setAuthForm(updatedForm);
    if (setFormValid) setFormValid(isFormValid);
  };

  const clearForm = (initialForm, setInitialForm, setFormInvalid) => {
    setInitialForm({ ...initialForm });
    if (setFormInvalid) setFormInvalid(false);
  };

  const onFacebookLoginClick = ({
    facebookLogin,
    contentLanguage,
    client,
    previousPage,
    closeSideDrawer = null,
    closeAuthModal = null,
  }) => {
    FB.login(
      async res => {
        if (res.status === 'connected') {
          const {
            authResponse: { accessToken, userID },
          } = res;
          const { data } = await facebookLogin({
            variables: {
              contentLanguage,
              accessToken,
              facebookUserId: userID,
            },
          });
          if (data) {
            const {
              facebookLogin: { user, firstLogin },
            } = data;
            if (firstLogin) {
              trackSignUp(user);
            } else {
              trackSignIn(user.id);
            }
            if (closeSideDrawer) {
              closeSideDrawer();
            } else if (closeAuthModal) {
              closeAuthModal();
            } else {
              Router.push(
                localStorage.getItem('previousPage') || previousPage || '/'
              );
              localStorage.removeItem('previousPage');
              client.writeData({ data: { previousPage: null } });
            }
          }
        }
      },
      {
        scope: 'public_profile',
      }
    );
  };

  const onSignout = async ({ signout, client }) => {
    await signout();
    localStorage.clear();
    await client.resetStore();
    if (FB && FB.getAccessToken()) FB.logout();
    return client.query({ query: CURRENT_USER_QUERY });
  };
  return (
    <>
      <Head>
        <title key="title">Danni TV - Đăng ký</title>
        <meta key="metaTitle" name="title" content="Danni TV - Đăng ký" />
      </Head>
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
        <Header as="h1" textAlign="center">
          Tạo tài khoản miễn phí
        </Header>
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
                inputChangeHandler(e, id, signupForm, setSignupForm)
              }
              touched={input.modified}
              autoComplete="new-password"
              displayPassword={displayPassword}
              onShowPasswordToggle={() => setdisplayPassword(!displayPassword)}
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
    </>
  );
};

RenderAuthForm.propTypes = {
  defaultForm: PropTypes.bool,
};

RenderAuthForm.defaultProps = {
  defaultForm: false,
};
export default RenderAuthForm;
