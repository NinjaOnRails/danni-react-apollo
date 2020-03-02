import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import generateName from 'sillyname';
import Head from 'next/head';
import { Button, Icon, Loader, Header, Divider } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import StyledForm from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { signupFields } from './fieldTypes';
import { trackSignUp } from '../../lib/mixpanel';
import { inputChangeHandler, onFacebookLoginClick } from './utils';
import {
  useFacebookLoginMutation,
  useLocalStateQuery,
  useSignupMutation,
} from './authHooks';
import { useCloseAuthModalMutation } from '../UI/uiHooks';

const Signup = ({ modal }) => {
  const [signupForm, setSignupForm] = useState({
    ...signupFields,
  });
  const [redirecting, setRedirecting] = useState(false);
  const [displayPassword, setdisplayPassword] = useState(false);
  const client = useApolloClient();
  const router = useRouter();

  const variables = {};
  const formElArr = [];
  Object.keys(signupForm).forEach(key => {
    variables[key] = signupForm[key].value;
    formElArr.push({
      id: key,
      input: signupForm[key],
    });
  });

  const [
    facebookLogin,
    { error: fbLoginError, loading: fbLoginLoading },
  ] = useFacebookLoginMutation();
  const [closeAuthModal] = useCloseAuthModalMutation();
  const { contentLanguage, previousPage } = useLocalStateQuery();
  const [signup, { error, loading }] = useSignupMutation({
    contentLanguage,
    variables,
  });

  useEffect(() => {
    const { displayName } = signupForm;
    setSignupForm({
      ...signupForm,
      displayName: { ...displayName, value: generateName(), valid: true },
    });
  }, []);

  const onSubmit = async ({ e }) => {
    e.preventDefault();
    const { data } = await signup();
    if (data) {
      trackSignUp(data.signup);
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
        <title key="title">Danni TV - Register</title>
        <meta key="metaTitle" name="title" content="Danni TV - Register" />
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
          Create a new account
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
              Submit{(loading || fbLoginLoading) && 'ting'}
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
          {!modal && (
            <div className="auth-links">
              <Link href="/signin">
                <a>Already have an account</a>
              </Link>
              <Link href="/requestReset">
                <a>
                  <span role="link" tabIndex={0} onClick={closeAuthModal}>
                    Forgot password?
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

Signup.propTypes = {
  modal: PropTypes.bool,
};

Signup.defaultProps = {
  modal: false,
};

export default Signup;
