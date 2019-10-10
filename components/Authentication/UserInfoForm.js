import { Checkbox, Item, Form, Loader, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import React, { Component } from 'react';

class UserInfoForm extends Component {
  state = {
    password: '',
    confirmPassword: '',
  };

  handleChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { currentUser, onCancelClick } = this.props;
    if (!currentUser)
      return (
        <Item.Content verticalAlign="middle">
          <Loader active inline="centered" />
        </Item.Content>
      );
    const { password, confirmPassword } = this.state;
    const {
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
      <Item.Content verticalAlign="middle">
        <Form size="large" unstackable>
          <Form.Group inline>
            <Form.Input
              label="Tên hiển thị"
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
              label="Họ và tên"
              type="text"
              id="name"
              name="name"
              defaultValue={name}
              onChange={this.handleChange}
            />
            <Checkbox
              label="Hiển thị"
              defaultChecked={showName}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Input
              label="Giới thiệu"
              type="text"
              id="bio"
              name="bio"
              defaultValue={bio}
              onChange={this.handleChange}
            />
            <Checkbox
              label="Hiển thị"
              defaultChecked={showBio}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Input
              label="Nơi sống"
              type="text"
              id="location"
              name="location"
              defaultValue={location}
              onChange={this.handleChange}
            />
            <Checkbox
              label="Hiển thị"
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
              label="Hiển thị"
              defaultChecked={showEmail}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Input
              label="Đổi mật khẩu"
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Form.Group inline>
            <Form.Input
              label="Xác nhận mật khẩu"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={this.handleChange}
            />
          </Form.Group>
          <Button type="submit" primary icon labelPosition="left" size="big">
            <Icon name="check" />
            Xác nhận
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
