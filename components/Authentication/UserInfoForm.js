import React, { Component } from 'react';
import { Checkbox, Item, Form, Button, Icon, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { UPDATE_USER_MUTATION } from '../../graphql/mutation';
import { USER_QUERY, CURRENT_USER_QUERY } from '../../graphql/query';
import Error from '../UI/ErrorMessage';
import { userInfoFields, userPasswordFields } from './fieldTypes';
import { validateInput } from './utils';

class UserInfoForm extends Component {
  state = {
    userPasswordForm: {
      ...userPasswordFields,
    },
    formValid: false,
    showPasswordChange: false,
    displayPassword: false,
  };

  handleChange = (e, { type, name, value, checked }) => {
    const val = type === 'checkbox' ? checked : value;
    this.setState({ [name]: val });
  };

  onSubmit = async (e, updateUser) => {
    e.preventDefault();
    const { data } = await updateUser();
    if (data) this.props.onCancelClick();
  };

  inputChangeHandler = (e, input) => {
    const eventValue = e.target.value;
    this.setState(prevState => {
      const updatedForm = {
        ...prevState.userPasswordForm,
      };
      const updatedInput = {
        ...updatedForm[input],
      };
      updatedInput.value = eventValue;
      updatedInput.valid = validateInput(
        updatedInput.value,
        updatedInput.validation
      );
      updatedInput.modified = true;
      updatedForm[input] = updatedInput;
      let formValid = true;
      Object.keys(updatedForm).forEach(key => {
        formValid = updatedForm[key].valid && formValid;
      });
      return { userPasswordForm: updatedForm, formValid };
    });
  };

  render() {
    const { currentUser, onCancelClick } = this.props;
    const {
      userPasswordForm,
      showPasswordChange,
      displayPassword,
    } = this.state;
    const { id } = currentUser;
    const variables = {};
    const formElArr = [];
    const formPassArr = [];
    Object.keys(userPasswordForm).forEach(key => {
      variables[key] = userPasswordForm[key].value;
      formPassArr.push({
        id: key,
        input: userPasswordForm[key],
      });
    });
    Object.keys(userInfoFields).forEach(key => {
      const boxName = userInfoFields[key].boxName;
      if (boxName) {
        variables[boxName] = this.state[boxName];
      }
      variables[key] = this.state[key];
      formElArr.push({
        id: key,
        input: userInfoFields[key],
      });
    });
    return (
      <Mutation
        mutation={UPDATE_USER_MUTATION}
        variables={{ ...variables }}
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
              onSubmit={e => this.onSubmit(e, updateUser)}
            >
              {formElArr.map(
                ({
                  id,
                  input: {
                    boxName,
                    inputConfig: { label, type, name },
                  },
                }) => (
                  <Form.Group inline key={id}>
                    <Form.Input
                      required={name === 'displayName' || name === 'email'}
                      label={label}
                      type={type}
                      id={name}
                      name={name}
                      defaultValue={currentUser[name]}
                      onChange={this.handleChange}
                    />
                    {boxName && (
                      <Checkbox
                        label="Công khai"
                        name={boxName}
                        defaultChecked={currentUser[boxName]}
                        onChange={this.handleChange}
                      />
                    )}
                  </Form.Group>
                )
              )}
              {(showPasswordChange &&
                formPassArr.map(
                  ({
                    id,
                    input: {
                      value,
                      inputConfig: { label, type, name },
                    },
                  }) => (
                    <Form.Group inline key={id}>
                      <Form.Input
                        label={label}
                        type={displayPassword ? 'text' : type}
                        id={name}
                        name={name}
                        value={value}
                        onChange={e => this.inputChangeHandler(e, id)}
                        autoComplete="new-password"
                      />
                      {name === 'password' && (
                        <Popup
                          content={
                            displayPassword
                              ? 'Giấu mật khẩu'
                              : 'Hiển thị mật khẩu'
                          }
                          trigger={
                            <Icon
                              className="display-hide-password"
                              name={displayPassword ? 'eye' : 'eye slash'}
                              onClick={() =>
                                this.setState({
                                  displayPassword: !displayPassword,
                                })
                              }
                            />
                          }
                        />
                      )}
                    </Form.Group>
                  )
                )) || (
                <p>
                  <Button
                    onClick={() => this.setState({ showPasswordChange: true })}
                  >
                    Đổi mật khẩu
                  </Button>
                </p>
              )}
              <Error error={error} />
              <Button
                type="submit"
                primary
                icon
                labelPosition="left"
                size="big"
              >
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
  }
}

UserInfoForm.propTypes = {
  currentUser: PropTypes.object,
  onCancelClick: PropTypes.func.isRequired,
};

UserInfoForm.defaultProps = {
  currentUser: null,
};

export default UserInfoForm;
