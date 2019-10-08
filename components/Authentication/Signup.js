import React, { Component } from 'react';
import { Query, Mutation } from 'react-apollo';
import Link from 'next/link';
import Router from 'next/router';
import PropTypes from 'prop-types';
import generateName from 'sillyname';
import { Button, Icon } from 'semantic-ui-react';
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

class Signup extends Component {
  state = {
    signupForm: {
      email: {
        inputConfig: {
          ...signupFields.email,
        },
        validation: {
          required: true,
          isEmail: true,
        },
        modified: false,
        valid: false,
        value: '',
      },
      name: {
        inputConfig: {
          ...signupFields.name,
        },
        // validation: {
        //   required: false,
        // },
        modified: false,
        valid: true,
        value: '',
      },
      displayName: {
        inputConfig: {
          ...signupFields.displayName,
        },
        // validation: {
        //   required: false,
        // },
        modified: false,
        valid: false,
        value: '',
      },
      password: {
        inputConfig: {
          ...signupFields.password,
        },
        validation: {
          required: true,
        },
        modified: false,
        valid: false,
        value: '',
      },
      confirmPassword: {
        inputConfig: {
          ...signupFields.confirmPassword,
        },
        modified: false,
        validation: {
          required: true,
        },
        valid: false,
        value: '',
      },
    },
    formValid: false,
    confirmMatch: null,
  };

  componentDidMount() {
    const { signupForm } = this.state;
    const { displayName } = signupForm;
    this.setState({
      signupForm: {
        ...signupForm,
        displayName: { ...displayName, value: generateName(), valid: true },
      },
    });
  }

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  inputchangeHandler = (e, input) => {
    const eventValue = e.target.value;
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.signupForm,
      };
      const updatedInput = {
        ...updatedForm[input],
      };
      updatedInput.value = eventValue;
      updatedInput.valid = this.checkValidity(
        updatedInput.value,
        updatedInput.validation
      );
      updatedInput.modified = true;
      updatedForm[input] = updatedInput;
      let formValid = true;
      for (let input in updatedForm) {
        formValid = updatedForm[input].valid && formValid;
      }
      return { signupForm: updatedForm, formValid };
    });
  };

  checkValidity = (value, rule) => {
    let isValid = true;
    if (!rule) {
      return true;
    }
    if (rule.required) {
      isValid = value.trim() !== '' && isValid;
    }
    if (rule.isEmail) {
      const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }
    return isValid;
  };

  onSubmit = async ({ e, signup, previousPage, client, closeAuthModal }) => {
    const {
      signupForm: { password, confirmPassword, email, name, displayName },
    } = this.state;
    e.preventDefault();
    if (password.value !== confirmPassword.value) {
      this.setState({
        formValid: false,
        confirmMatch: { message: 'Mật khẩu không khớp' },
      });
    } else {
      this.setState({ confirmMatch: null });
      const { data } = await signup();
      this.setState({
        signupForm: {
          email: { ...email, value: '', valid: false, modified: false },
          name: { ...name, value: '', modified: false },
          displayName: { ...displayName, value: '', modified: false },
          password: { ...password, value: '', valid: false, modified: false },
          confirmPassword: {
            ...confirmPassword,
            value: '',
            valid: false,
            modified: false,
          },
        },
      });
      if (data) {
        trackSignUp(data.signup);
        Router.push(
          localStorage.getItem('previousPage') || previousPage || '/'
        );
        localStorage.removeItem('previousPage');
        client.writeData({ data: { previousPage: null } });
        closeAuthModal();
      }
    }
  };

  render() {
    const { formValid, signupForm, confirmMatch } = this.state;
    const { modal } = this.props;
    const variables = {};
    for (let key in signupForm) {
      variables[key] = signupForm[key].value;
    }
    console.log(signupForm);
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
            facebookLoginResult: {
              error: fbLoginError,
              loading: fbLoginLoading,
            },
          },
        }) => {
          const formElArr = [];
          for (let key in signupForm) {
            formElArr.push({
              id: key,
              input: signupForm[key],
            });
          }
          return (
            <StyledForm
              method="post"
              onSubmit={async e =>
                this.onSubmit({
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
                <Error error={confirmMatch} />
                {formElArr.map(({ id, input }) => (
                  <AuthForm
                    key={id}
                    value={input.value}
                    config={input.inputConfig}
                    shouldValidate={input.validation}
                    invalid={!input.valid}
                    saveToState={e => this.inputchangeHandler(e, id)}
                    touched={input.modified}
                    autoComplete="new-password"
                  />
                ))}
                <div className="center">
                  <button
                    type="submit"
                    disabled={loading || fbLoginLoading || !formValid}
                  >
                    {(loading || fbLoginLoading) && 'Đang '}Đăng Ký
                  </button>
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
                    <Icon name="facebook" /> Dùng Facebook
                  </Button>
                </div>
                {/* <button type="submit">Sign{loading && 'ing'} Up</button> */}
              </fieldset>
              <div className="auth-links">
                {!modal && (
                  <>
                    <Link href="/signin">
                      <a>Đã có tài khoản</a>
                    </Link>
                    ---
                    <Link href="/requestReset">
                      <a>
                        <span role="link" tabIndex={0} onClick={closeAuthModal}>
                          Quên mật khẩu
                        </span>
                      </a>
                    </Link>
                  </>
                )}
              </div>
            </StyledForm>
          );
        }}
      </Composed>
    );
  }
}

Signup.propTypes = {
  modal: PropTypes.bool,
};

Signup.defaultProps = {
  modal: false,
};

export default Signup;
