import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Message } from 'semantic-ui-react';
import Form from '../styles/Form';
import { signupFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { REQUEST_RESET_MUTATION } from '../../graphql/mutation';
import {validateInput} from './utils';

const RequestReset = () => {
  const [requestResetForm, setRequestResetForm] = useState({
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
  });
  const [formValid, setFormValid] = useState(false);

  const inputChangeHandler = (e, input) => {
    const eventValue = e.target.value;
    const updatedForm = {
      ...requestResetForm,
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
    setRequestResetForm(updatedForm);
    setFormValid(isFormValid);
  };

  const {
    email: { value, inputConfig, modified, valid, validation },
  } = requestResetForm;
  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email: value }}>
      {(requestReset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await requestReset();
              setRequestResetForm({
                email: {
                  ...requestResetForm.email,
                  modified: false,
                  valid: false,
                  value: '',
                },
              });
              setFormValid(false);
            }}
          >
            <fieldset
              disabled={loading}
              aria-busy={loading}
              style={{ marginTop: '10px', textAlign: 'center' }}
            >
              {!error && !loading && called && (
                <Message info>Hãy kiểm tra e-mail của bạn để tiếp tục.</Message>
              )}
              <h2>Yêu cầu đổi mật khẩu</h2>
              <AuthForm
                value={value}
                config={inputConfig}
                shouldValidate={validation}
                invalid={!valid}
                saveToState={e => inputChangeHandler(e, 'email')}
                touched={modified}
              />
              <div className="center">
                <button type="submit" disabled={loading || !formValid}>
                  Gửi
                </button>
              </div>
            </fieldset>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default RequestReset;
