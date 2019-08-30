import React from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({
  form: { type, name, label, placeholder },
  value,
  saveToState,
}) => (
  <label htmlFor={name}>
    {label}
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value[name]}
      onChange={saveToState}
    />
  </label>
);

AuthForm.propTypes = {
  form: PropTypes.object.isRequired,
  value: PropTypes.object.isRequired,
  saveToState: PropTypes.func.isRequired,
};

export default AuthForm;
