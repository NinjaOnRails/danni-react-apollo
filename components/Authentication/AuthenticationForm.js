import React from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({
  form: { type, name, label, placeholder },
  value,
  saveToState,
  autoComplete,
}) => (
  <label htmlFor={name}>
    {label}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value[name]}
      onChange={saveToState}
      autoFocus={type === 'email'}
      autoComplete={autoComplete}
    />
  </label>
);

AuthForm.defaultProps = {
  autoComplete: 'on',
};

AuthForm.propTypes = {
  form: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  saveToState: PropTypes.func.isRequired,
  autoComplete: PropTypes.string,
};

export default AuthForm;
