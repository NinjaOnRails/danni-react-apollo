import React, { useState } from 'react';
import { Message } from 'semantic-ui-react';
import Form from '../styles/Form';
import { requestResetFields } from './fieldTypes';
import AuthForm from './AuthenticationForm';
import { inputChangeHandler, clearForm } from './utils';
import { useRequestResetMutation } from './authHooks';

const RequestReset = () => {
  const [requestResetForm, setRequestResetForm] = useState({
    ...requestResetFields,
  });
  const [formValid, setFormValid] = useState(false);

  const {
    email: { value, inputConfig, modified, valid, validation },
  } = requestResetForm;

  const [requestReset, { error, loading, called }] = useRequestResetMutation();

  return (
    <Form
      method="post"
      onSubmit={async e => {
        e.preventDefault();
        await requestReset(value);
        clearForm(requestResetFields, setRequestResetForm, setFormValid);
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
};

export default RequestReset;
