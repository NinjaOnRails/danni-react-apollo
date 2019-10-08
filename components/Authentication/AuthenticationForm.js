import React from 'react';
import PropTypes from 'prop-types';

const AuthForm = ({
  value,
  config,
  saveToState,
  autoComplete,
  shouldValidate,
  invalid,
  touched,
}) => (
  <div className="auth-input">
    <input
      className={`${shouldValidate && invalid && touched ? 'invalid' : null}`}
      type={config.type}
      name={config.name}
      value={value}
      onChange={saveToState}
      data-empty={!value}
      autoComplete={autoComplete}
    />
    <label htmlFor={config.name}>{config.label}</label>
  </div>
);

AuthForm.defaultProps = {
  autoComplete: 'on',
};

AuthForm.propTypes = {
  config: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  saveToState: PropTypes.func.isRequired,
  shouldValidate: PropTypes.bool.isRequired,
  invalid: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  autoComplete: PropTypes.string,
};

export default AuthForm;
