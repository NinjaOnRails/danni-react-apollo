import { useState } from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { Button, Icon, Loader, Header, Divider } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { signinFields } from './fieldTypes';
import { trackSignIn } from '../../lib/mixpanel';
import { inputChangeHandler, onFacebookLoginClick } from './utils';
import {
  useSigninMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
} from './authHooks';
import { useCloseAuthModalMutation } from '../UI/uiHooks';

const Signin = ({ modal }) => {
  const [signinForm, setSigninForm] = useState({
    ...signinFields,
  });
  const [redirecting, setRedirecting] = useState(false);

  const { contentLanguage, previousPage } = useLocalStateQuery();
  const [signin, { error, loading }] = useSigninMutation();

  const [closeAuthModal] = useCloseAuthModalMutation();

  const router = useRouter();
  const [
    facebookLogin,
    { error: fbLoginError, loading: fbLoginLoading },
  ] = useFacebookLoginMutation();

  const client = useApolloClient();
  const variables = {};
  const formElArr = [];
  Object.keys(signinForm).forEach(key => {
    variables[key] = signinForm[key].value;
    formElArr.push({
      id: key,
      input: signinForm[key],
    });
  });

  const onSubmit = async ({ e }) => {
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
        router.push(
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
        Redirecting...
      </Loader>
    );
  return (
    <>
      <Head>
        <title key="title">Danni TV - Log in</title>
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
          Log in {modal && 'to continue'}
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
              Log{(loading || fbLoginLoading) && 'ging'} in
            </button>
            <Divider horizontal>Or</Divider>
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
              Log in with Facebook
            </Button>
          </div>
          <div className="auth-links">
            {!modal && (
              <Link href="/signup">
                <a>Create a new account</a>
              </Link>
            )}
            <Link href="/requestReset">
              <a>
                <span role="link" tabIndex={0} onClick={closeAuthModal}>
                  Forgot password?
                </span>
              </a>
            </Link>
          </div>
        </fieldset>
      </StyledForm>
    </>
  );
};

Signin.propTypes = {
  modal: PropTypes.bool,
};

Signin.defaultProps = {
  modal: false,
};

export default Signin;
