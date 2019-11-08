import React, { useState } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import { Button, Icon, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { signinFields } from './fieldTypes';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import { client, contentLanguageQuery } from '../UI/ContentLanguage';
import {
  CONTENT_LANGUAGE_QUERY,
  CURRENT_USER_QUERY,
} from '../../graphql/query';
import {
  CLOSE_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  SIGNIN_MUTATION,
} from '../../graphql/mutation';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { inputChangeHandler, clearForm } from './utils';

/* eslint-disable */
const signinMutation = ({ render, variables }) => (
  <Mutation
    mutation={SIGNIN_MUTATION}
    variables={variables}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(signin, signinResult) => render({ signin, signinResult })}
  </Mutation>
);

const facebookLoginMutation = ({ render }) => (
  <Mutation
    mutation={FACEBOOK_LOGIN_MUTATION}
    refetchQueries={[{ query: CURRENT_USER_QUERY }]}
  >
    {(facebookLogin, facebookLoginResult) =>
      render({ facebookLogin, facebookLoginResult })
    }
  </Mutation>
);

const closeAuthModal = ({ render }) => (
  <Mutation mutation={CLOSE_AUTH_MODAL_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const Composed = adopt({
  client,
  localState: ({ render }) => (
    <Query query={CONTENT_LANGUAGE_QUERY}>{render}</Query>
  ),
  facebookLoginMutation,
  contentLanguageQuery,
  signinMutation,
  closeAuthModal,
});

const onFacebookLoginClick = ({
  facebookLogin,
  contentLanguage,
  client,
  data: { previousPage },
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

const Signin = ({ modal }) => {
  const [signinForm, setSigninForm] = useState({
    ...signinFields,
  });
  const [formValid, setFormValid] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const onSubmit = async ({
    e,
    signin,
    data: { previousPage },
    client,
    closeAuthModal,
  }) => {
    e.preventDefault();
    const { data } = await signin();
    if (data) {
      clearForm(signinFields, setSigninForm, setFormValid);
      trackSignIn(data.signin.id);
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
  Object.keys(signinForm).forEach(key => {
    variables[key] = signinForm[key].value;
    formElArr.push({
      id: key,
      input: signinForm[key],
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
        facebookLoginMutation: {
          facebookLogin,
          facebookLoginResult: { error: fbLoginError, loading: fbLoginLoading },
        },
        contentLanguageQuery: { contentLanguage },
        signinMutation: {
          signin,
          signinResult: { error, loading },
        },
        closeAuthModal,
      }) => (
        <StyledForm
          method="post"
          onSubmit={e =>
            onSubmit({
              e,
              signin,
              data,
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
                    data,
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
    </Composed>
  );
};

Signin.propTypes = {
  modal: PropTypes.bool,
};

Signin.defaultProps = {
  modal: false,
};

export default Signin;
export {
  onFacebookLoginClick,
  facebookLoginMutation,
  signinMutation,
  closeAuthModal,
};
