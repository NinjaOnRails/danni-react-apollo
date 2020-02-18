import React, { Component } from 'react';
import { Checkbox, Item, Form, Button, Icon, Popup } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import { UPDATE_USER_MUTATION } from '../../graphql/mutation';
import { USER_QUERY, CURRENT_USER_QUERY } from '../../graphql/query';
import Error from '../UI/ErrorMessage';

class UserInfoForm extends Component {
  state = {
    password: '',
    newPassword: '',
    confirmPassword: '',
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

  render() {
    const { currentUser, onCancelClick } = this.props;
    const {
      password,
      newPassword,
      confirmPassword,
      showPasswordChange,
      displayPassword,
    } = this.state;
    const {
      id,
      displayName,
      name,
      showName,
      bio,
      showBio,
      email,
      showEmail,
      location,
      showLocation,
    } = currentUser;
    return (
      <Mutation
        mutation={UPDATE_USER_MUTATION}
        variables={this.state}
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
              <Form.Group inline>
                <Form.Input
                  label="Display name"
                  required
                  type="text"
                  id="displayName"
                  name="displayName"
                  defaultValue={displayName}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group inline>
                <Form.Input
                  label="Name"
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={name}
                  onChange={this.handleChange}
                />
                <Checkbox
                  label="Public"
                  name="showName"
                  defaultChecked={showName}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group inline>
                <Form.Input
                  label="Info"
                  type="text"
                  id="bio"
                  name="bio"
                  defaultValue={bio}
                  onChange={this.handleChange}
                />
                <Checkbox
                  label="Public"
                  name="showBio"
                  defaultChecked={showBio}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group inline>
                <Form.Input
                  label="Location"
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={location}
                  onChange={this.handleChange}
                />
                <Checkbox
                  label="Public"
                  name="showLocation"
                  defaultChecked={showLocation}
                  onChange={this.handleChange}
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
                  onChange={this.handleChange}
                />
                <Checkbox
                  label="Public"
                  name="showEmail"
                  defaultChecked={showEmail}
                  onChange={this.handleChange}
                />
              </Form.Group>
              {(showPasswordChange && (
                <>
                  <Form.Group inline>
                    <Form.Input
                      label="Old password"
                      type={displayPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={password}
                      onChange={this.handleChange}
                    />
                    <Popup
                      content={
                        displayPassword ? 'Hide password' : 'Show password'
                      }
                      trigger={
                        <Icon
                          className="display-hide-password"
                          name={displayPassword ? 'eye' : 'eye slash'}
                          onClick={() =>
                            this.setState({ displayPassword: !displayPassword })
                          }
                        />
                      }
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Input
                      label="New password"
                      type={displayPassword ? 'text' : 'password'}
                      id="newPassword"
                      name="newPassword"
                      value={newPassword}
                      onChange={this.handleChange}
                      autoComplete="new-password"
                    />
                  </Form.Group>
                  <Form.Group inline>
                    <Form.Input
                      label="Confirm password"
                      type={displayPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </>
              )) || (
                <p>
                  <Button
                    onClick={() => this.setState({ showPasswordChange: true })}
                  >
                    Change password
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
                Submit{loading && 'ting'}
              </Button>
              <Button
                type="button"
                icon
                labelPosition="left"
                size="big"
                onClick={onCancelClick}
              >
                <Icon name="cancel" />
                Cancel
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
