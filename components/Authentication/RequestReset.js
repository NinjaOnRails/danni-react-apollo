import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { Message } from 'semantic-ui-react';
import Head from 'next/head';
import Form from '../styles/Form';
import { signupFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { REQUEST_RESET_MUTATION } from '../../graphql/mutation';
import validateInput from './utils';

class RequestReset extends Component {
  state = {
    requestResetForm: {
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
    },
    formValid: false,
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  inputchangeHandler = (e, input) => {
    const eventValue = e.target.value;
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.requestResetForm,
      };
      const updatedInput = {
        ...updatedForm[input],
      };
      updatedInput.value = eventValue;
      updatedInput.valid = validateInput(
        updatedInput.value,
        updatedInput.validation
      );
      updatedInput.modified = true;
      updatedForm[input] = updatedInput;
      let formValid = true;
      Object.keys(updatedForm).forEach(key => {
        formValid = updatedForm[key].valid && formValid;
      });
      return { requestResetForm: updatedForm, formValid };
    });
  };

  render() {
    const {
      formValid,
      requestResetForm: {
        email: { value, inputConfig, modified, valid, validation },
      },
    } = this.state;
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email: value }}>
        {(requestReset, { error, loading, called }) => {
          return (
            <>
              <Head>
                <title key="title">Danni TV - Yêu cầu đổi mật khẩu</title>
                <meta
                  key="metaTitle"
                  name="title"
                  content="Danni TV - Yêu cầu đổi mật khẩu"
                />
              </Head>
              <Form
                method="post"
                onSubmit={async e => {
                  e.preventDefault();
                  await requestReset();
                  this.setState({
                    requestResetForm: {
                      email: {
                        value: '',
                        inputConfig,
                        modified: false,
                        valid: false,
                        validation,
                      },
                    },
                    formValid: false,
                  });
                }}
              >
                <fieldset
                  disabled={loading}
                  aria-busy={loading}
                  style={{ marginTop: '10px', textAlign: 'center' }}
                >
                  {!error && !loading && called && (
                    <Message info>
                      Hãy kiểm tra e-mail của bạn để tiếp tục.
                    </Message>
                  )}
                  <h2>Yêu cầu đổi mật khẩu</h2>
                  <AuthForm
                    value={value}
                    config={inputConfig}
                    shouldValidate={validation}
                    invalid={!valid}
                    saveToState={e => this.inputchangeHandler(e, 'email')}
                    touched={modified}
                  />
                  <div className="center">
                    <button type="submit" disabled={loading || !formValid}>
                      Gửi
                    </button>
                  </div>
                </fieldset>
              </Form>
            </>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
