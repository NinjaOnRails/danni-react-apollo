import React, { useState, useEffect } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import generateName from 'sillyname';
import { Button, Icon, Loader } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import {
  CURRENT_USER_QUERY,
  CONTENT_LANGUAGE_QUERY,
} from '../../graphql/query';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import { SIGNUP_MUTATION } from '../../graphql/mutation';
import { client } from '../UI/ContentLanguage';
import {
  onFacebookLoginClick,
  facebookLoginMutation,
  closeAuthModal,
} from './Signin';

import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { inputChangeHandler, clearForm } from './utils';

/* eslint-disable */
const signupMutation = ({ localState: { data }, variables, render }) => (
  <Mutation
    mutation={SIGNUP_MUTATION}
    variables={{
      ...variables,
      contentLanguage: data ? data.contentLanguage : [],
    }}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signup, signupResult) => {
      return render({ signup, signupResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  signupMutation,
  closeAuthModal,
  facebookLoginMutation,
});

const Signup = ({ modal }) => {
  const [signupForm, setSignupForm] = useState({
    ...signupFields,
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [displayPassword, setdisplayPassword] = useState(false);

  useEffect(() => {
    const { displayName } = signupForm;
    setSignupForm({
      ...signupForm,
      displayName: { ...displayName, value: generateName(), valid: true },
    });
  }, []);

  const onSubmit = async ({
    e,
    signup,
    previousPage,
    client,
    closeAuthModal,
  }) => {
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

  const variables = {};
  const formElArr = [];
  Object.keys(signupForm).forEach(key => {
    variables[key] = signupForm[key].value;
    formElArr.push({
      id: key,
      input: signupForm[key],
    });
  });
  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );
  return (
    <Composed variables={variables}>
      {({
        client,
        localState: { data },
        signupMutation: {
          signup,
          signupResult: { error, loading },
        },
        closeAuthModal,
        facebookLoginMutation: {
          facebookLogin,
          facebookLoginResult: { error: fbLoginError, loading: fbLoginLoading },
        },
      }) => {
        return (
          <StyledForm
            method="post"
            onSubmit={e =>
              onSubmit({
                e,
                signup,
                previousPage: data.previousPage,
                client,
                closeAuthModal,
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
                      contentLanguage: data.contentLanguage,
                      client,
                      data,
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
    </Composed>
  );
};

Signup.propTypes = {
  modal: PropTypes.bool,
};

Signup.defaultProps = {
  modal: false,
};

export default Signup;
