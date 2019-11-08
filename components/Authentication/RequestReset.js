import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { Message } from 'semantic-ui-react';
import Form from '../styles/Form';
import { requestResetFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { REQUEST_RESET_MUTATION } from '../../graphql/mutation';
import { inputChangeHandler } from './utils';

const RequestReset = () => {
  const [requestResetForm, setRequestResetForm] = useState({
    ...requestResetFields,
  });
  const [formValid, setFormValid] = useState(false);

  const {
    email: { value, inputConfig, modified, valid, validation },
  } = requestResetForm;

  const clearRequestResetForm = () => {
    setRequestResetForm({
      email: {
        ...requestResetForm.email,
        modified: false,
        valid: false,
        value: '',
      },
    });
    setFormValid(false);
  };
  return (
    <Mutation mutation={REQUEST_RESET_MUTATION} variables={{ email: value }}>
      {(requestReset, { error, loading, called }) => {
        return (
          <Form
            method="post"
            onSubmit={async e => {
              e.preventDefault();
              await requestReset();
              clearRequestResetForm();
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
                saveToState={e =>
                  inputChangeHandler(
                    e,
                    'email',
                    requestResetForm,
                    setRequestResetForm,
                    setFormValid
                  )
                }
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
