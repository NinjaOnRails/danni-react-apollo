import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Item, Form, Button, Icon, Popup } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { userInfoFields, userPasswordFields } from './fieldTypes';
import { inputChangeHandler, clearForm } from './utils';
import { useUpdateUserMutation } from './authHooks';

const UserInfoForm = ({ currentUser, onCancelClick }) => {
  const [userPasswordForm, setUserPasswordForm] = useState({
    ...userPasswordFields,
  });
  const [userInfoForm, setUserInfoForm] = useState({ ...userInfoFields });
  const [infoVisibility, setInfoVisibility] = useState({});

  const [displayPassword, setDisplayPassword] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(null);

  const { id } = currentUser;
  const variables = {};
  const formElArr = [];
  const formPassArr = [];
  if (showPasswordChange) {
    Object.keys(userPasswordForm).forEach(key => {
      variables[key] = userPasswordForm[key].value;
      formPassArr.push({
        id: key,
        input: userPasswordForm[key],
      });
    });
  }
  Object.keys(userInfoForm).forEach(key => {
    const { boxName } = userInfoForm[key];

    if (boxName) {
      variables[boxName] = infoVisibility[boxName];
    }
    if (userInfoForm[key].value) {
      variables[key] = userInfoForm[key].value;
    }
    formElArr.push({
      id: key,
      input: userInfoForm[key],
    });
  });
  
  const [updateUser, { loading, error }] = useUpdateUserMutation({
    id,
    variables,
  });

  const handleChange = (e, { name, checked }) => {
    setInfoVisibility({ ...infoVisibility, [name]: checked });
  };

  const onSubmit = async e => {
    e.preventDefault();
    const { newPassword, confirmPassword } = userPasswordForm;
    if (newPassword.value !== confirmPassword.value) {
      clearForm(userPasswordFields, setUserPasswordForm);
      setPasswordsMatch({
        message: 'Mật khẩu mới không khớp. Xin vui lòng điền lại',
      });
    } else {
      setPasswordsMatch(null);
      const { data } = await updateUser();
      if (data) onCancelClick();
    }
  };

  return (
    <Item.Content verticalAlign="middle">
      <Form
        size="large"
        unstackable
        loading={loading}
        onSubmit={e => onSubmit(e)}
      >
        <Error error={error} />
        <Error error={passwordsMatch} />
        {formElArr.map(
          ({
            id: inputId,
            input: {
              boxName,
              modified,
              validation,
              valid,
              inputConfig: { label, type, name },
            },
          }) => (
            <Form.Group inline key={inputId}>
              <Form.Input
                required={name === 'displayName' || name === 'email'}
                label={label}
                type={type}
                id={name}
                name={name}
                defaultValue={currentUser[name]}
                error={validation && !valid && modified}
                onChange={e =>
                  inputChangeHandler(e, inputId, userInfoForm, setUserInfoForm)
                }
              />
              {boxName && (
                <Checkbox
                  label="Công khai"
                  name={boxName}
                  defaultChecked={currentUser[boxName]}
                  onChange={handleChange}
                />
              )}
            </Form.Group>
          )
        )}
        {(showPasswordChange &&
          formPassArr.map(
            ({
              id: inputId,
              input: {
                value,
                modified,
                validation,
                valid,
                mustMatch,
                inputConfig: { label, type, name },
              },
            }) => (
              <Form.Group inline key={inputId}>
                <Form.Input
                  autoComplete="new-password"
                  label={label}
                  type={displayPassword ? 'text' : type}
                  id={name}
                  name={name}
                  value={value}
                  error={
                    (validation && !valid && modified) ||
                    (mustMatch && passwordsMatch && !modified)
                  }
                  onChange={e =>
                    inputChangeHandler(
                      e,
                      inputId,
                      userPasswordForm,
                      setUserPasswordForm
                    )
                  }
                />
                {name === 'password' && (
                  <Popup
                    content={
                      displayPassword ? 'Giấu mật khẩu' : 'Hiển thị mật khẩu'
                    }
                    trigger={
                      <Icon
                        className="display-hide-password"
                        name={displayPassword ? 'eye' : 'eye slash'}
                        onClick={() => setDisplayPassword(!displayPassword)}
                      />
                    }
                  />
                )}
              </Form.Group>
            )
          )) || (
          <p>
            <Button
              onClick={() => {
                setShowPasswordChange(true);
              }}
            >
              Đổi mật khẩu
            </Button>
          </p>
        )}

        <Button type="submit" primary icon labelPosition="left" size="big">
          <Icon name="check" />
          {loading && 'Đang '}Xác nhận
        </Button>
        <Button
          type="button"
          icon
          labelPosition="left"
          size="big"
          onClick={onCancelClick}
        >
          <Icon name="cancel" />
          Huỷ
        </Button>
      </Form>
    </Item.Content>
  );
};

UserInfoForm.propTypes = {
  currentUser: PropTypes.object,
  onCancelClick: PropTypes.func.isRequired,
};

UserInfoForm.defaultProps = {
  currentUser: null,
};

export default UserInfoForm;
