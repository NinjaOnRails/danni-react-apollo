import PropTypes from 'prop-types';
import { Icon, Popup } from 'semantic-ui-react';

const AuthForm = ({
  value,
  config,
  saveToState,
  autoComplete,
  shouldValidate,
  invalid,
  touched,
  displayPassword,
  onShowPasswordToggle,
}) => (
  <div className="auth-input">
    <input
      className={`${
        shouldValidate.required && invalid && touched ? 'invalid' : ''
      }`}
      type={`${
        displayPassword && config.type === 'password' ? 'text' : config.type
      }`}
      name={config.name}
      value={value}
      onChange={saveToState}
      data-empty={!value}
      autoComplete={autoComplete}
    />
    <label htmlFor={config.name}>{config.label}</label>
    {config.type === 'password' && onShowPasswordToggle && (
      <Popup
        content={displayPassword ? 'Giấu mật khẩu' : 'Hiển thị mật khẩu'}
        trigger={
          <Icon
            style={{
              display: 'inline-block',
              position: 'absolute',
              top: '12px',
              right: '11px',
            }}
            className="display-hide-password"
            name={displayPassword ? 'eye' : 'eye slash'}
            onClick={onShowPasswordToggle}
          />
        }
      />
    )}
  </div>
);

AuthForm.defaultProps = {
  autoComplete: 'on',
  displayPassword: false,
  shouldValidate: { required: false },
  onShowPasswordToggle: null,
};

AuthForm.propTypes = {
  config: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  saveToState: PropTypes.func.isRequired,
  shouldValidate: PropTypes.object,
  invalid: PropTypes.bool.isRequired,
  touched: PropTypes.bool.isRequired,
  displayPassword: PropTypes.bool,
  autoComplete: PropTypes.string,
  onShowPasswordToggle: PropTypes.func,
};

export default AuthForm;
