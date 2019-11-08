import React, { useState } from 'react';
import { Checkbox, Item, Form, Button, Icon, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { UPDATE_USER_MUTATION } from '../../graphql/mutation';
import { USER_QUERY, CURRENT_USER_QUERY } from '../../graphql/query';
import Error from '../UI/ErrorMessage';
import { inputChangeHandler } from './utils';
import { userInfoFields } from './fieldTypes';

const UserInfoForm = ({ currentUser, onCancelClick }) => {
  const [userInfoForm, setUserInfoForm] = useState({
    password: {
      inputConfig: {
        ...userInfoFields.password,
      },
      validation: {
        required: true,
        minLength: 6,
      },
      modified: false,
      valid: false,
      value: '',
    },
    newPassword: {
      inputConfig: {
        ...userInfoFields.newPassword,
      },
      validation: {
        required: true,
        minLength: 6,
      },
      modified: false,
      valid: false,
      value: '',
    },
    confirmPassword: {
      inputConfig: {
        ...userInfoFields.confirmPassword,
      },
      validation: {
        required: true,
        minLength: 6,
      },
      modified: false,
      valid: false,
      value: '',
    },
  });
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [displayPassword, setDisplayPassword] = useState(false);

  const handleChange = (e, { type, name, value, checked }) => {
    const val = type === 'checkbox' ? checked : value;
    this.setState({ [name]: val });
  };

  const onSubmit = async (e, updateUser) => {
    e.preventDefault();
    const { data } = await updateUser();
    if (data) onCancelClick();
  };

  const { password, newPassword, confirmPassword } = userInfoForm;
  const { id } = currentUser;
  return (
    <Mutation
      mutation={UPDATE_USER_MUTATION}
      variables={{
        password: password.value,
        newPassword: newPassword.value,
        confirmPassword: confirmPassword.value,
      }}
      refetchQueries={[
        {
          query: USER_QUERY,
          variables: {
            id,
          },
        },
        {
          query: CURRENT_USER_QUERY,
        },
      ]}
    >
      {(updateUser, { loading, error }) => (
        <Item.Content verticalAlign="middle">
          <Form
            size="large"
            unstackable
            loading={loading}
            onSubmit={e => onSubmit(e, updateUser)}
          >
            {Object.keys(userInfoFields).map(
              ({ label, type, name, boxName }) => (
                <Form.Group inline>
                  <Form.Input
                    label={label}
                    type={type}
                    id={name}
                    name={name}
                    defaultValue={currentUser[name]}
                    onChange={handleChange}
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
            {/* <Form.Group inline>
              <Form.Input
                label="Tên hiển thị"
                required
                type="text"
                id="displayName"
                name="displayName"
                defaultValue={displayName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                label="Họ và tên"
                type="text"
                id="name"
                name="name"
                defaultValue={name}
                onChange={handleChange}
              />
              <Checkbox
                label="Công khai"
                name="showName"
                defaultChecked={showName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                label="Giới thiệu"
                type="text"
                id="bio"
                name="bio"
                defaultValue={bio}
                onChange={handleChange}
              />
              <Checkbox
                label="Công khai"
                name="showBio"
                defaultChecked={showBio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                label="Nơi sống"
                type="text"
                id="location"
                name="location"
                defaultValue={location}
                onChange={handleChange}
              />
              <Checkbox
                label="Công khai"
                name="showLocation"
                defaultChecked={showLocation}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group inline>
              <Form.Input
                label="E-mail"
                required
                type="email"
                id="email"
                name="email"
                defaultValue={email}
                onChange={handleChange}
              />
              <Checkbox
                label="Công khai"
                name="showEmail"
                defaultChecked={showEmail}
                onChange={handleChange}
              />
            </Form.Group> */}
            {(showPasswordChange && (
              <>
                <Form.Group inline>
                  <Form.Input
                    label="Mật khẩu cũ"
                    type={displayPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
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
                </Form.Group>
                <Form.Group inline>
                  <Form.Input
                    label="Mật khẩu mới"
                    type={displayPassword ? 'text' : 'password'}
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </Form.Group>
                <Form.Group inline>
                  <Form.Input
                    label="Lặp lại m/k mới"
                    type={displayPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                  />
                </Form.Group>
              </>
            )) || (
              <p>
                <Button onClick={() => setShowPasswordChange(true)}>
                  Đổi mật khẩu
                </Button>
              </p>
            )}
            <Error error={error} />
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
      )}
    </Mutation>
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
