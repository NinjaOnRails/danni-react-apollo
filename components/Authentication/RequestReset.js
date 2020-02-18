import { useState } from 'react';
import Head from 'next/head';
import { Message } from 'semantic-ui-react';
import Form from '../styles/Form';
import AuthForm from './AuthenticationForm';
import { requestResetFields } from './fieldTypes';
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

  const [requestReset, { error, loading, called }] = useRequestResetMutation(
    value
  );

  return (
    <>
      <Head>
        <title key="title">Danni TV - Request password reset</title>
        <meta
          key="metaTitle"
          name="title"
          content="Danni TV - Request password reset"
        />
      </Head>
      <Form
        method="post"
        onSubmit={async e => {
          e.preventDefault();
          await requestReset();
          clearForm(requestResetFields, setRequestResetForm, setFormValid);
        }}
      >
        <fieldset
          disabled={loading}
          aria-busy={loading}
          style={{ marginTop: '10px', textAlign: 'center' }}
        >
          {!error && !loading && called && (
            <Message info>Check your email to continue</Message>
          )}

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
              Submit
            </button>
          </div>
        </fieldset>
      </Form>
    </>
  );
};

export default RequestReset;
