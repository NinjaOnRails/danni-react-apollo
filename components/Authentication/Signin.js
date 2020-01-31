import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { ApolloConsumer, Mutation } from 'react-apollo';
import { Button, Icon, Loader, Header } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { signinFields } from './fieldTypes';
import { trackSignIn, trackSignUp } from '../../lib/mixpanel';
import {
  inputChangeHandler,
  // onFacebookLoginClick
} from './utils';
import {
  useSigninMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
} from './authHooks';
import { CURRENT_USER_QUERY } from '../../graphql/query';
import {
  CLOSE_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  SIGNIN_MUTATION,
} from '../../graphql/mutation';
import { useCloseAuthModalMutation } from '../UI/uiHooks';

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
  const [redirecting, setRedirecting] = useState(false);

  const { contentLanguage, previousPage } = useLocalStateQuery();
  const [signin, { error, loading }] = useSigninMutation();

  const [closeAuthModal] = useCloseAuthModalMutation();

  const [
    facebookLogin,
    { error: fbLoginError, loading: fbLoginLoading },
  ] = useFacebookLoginMutation();

  const variables = {};
  const formElArr = [];
  Object.keys(signinForm).forEach(key => {
    variables[key] = signinForm[key].value;
    formElArr.push({
      id: key,
      input: signinForm[key],
    });
  });

  const onSubmit = async ({ e, client }) => {
    e.preventDefault();
    const { data } = await signin({
      variables: { ...variables },
    });
    if (data) {
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

  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );
  return (
    <ApolloConsumer>
      {client => (
        <>
          <Head>
            <title key="title">Danni TV - Đăng nhập</title>
            <meta key="metaTitle" name="title" content="Danni TV - Đăng nhập" />
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
              Đăng nhập {modal && 'để tiếp tục'}
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
                    inputChangeHandler(e, id, signinForm, setSigninForm)
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
        </>
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
export {
  onFacebookLoginClick,
  facebookLoginMutation,
  signinMutation,
  closeAuthModal,
};
