const signinFields = {
  email: {
    inputConfig: {
      label: 'E-mail',
      type: 'email',
      name: 'email',
    },
    validation: {
      required: true,
      isEmail: true,
    },
    modified: false,
    valid: false,
    value: '',
  },
  password: {
    inputConfig: { label: 'Mật khẩu', type: 'password', name: 'password' },
    validation: {
      required: true,
      minLength: 6,
    },
    modified: false,
    valid: false,
    value: '',
  },
};

const signupFields = {
  ...signinFields,
  displayName: {
    inputConfig: {
      label: 'Tên hiển thị',
      type: 'displayName',
      name: 'displayName',
    },
    modified: false,
    valid: false,
    value: '',
  },
};

const requestResetFields = {
  email: {
    ...signinFields.email,
  },
};

const resetFields = {
  password: {
    ...signinFields.password,
    inputConfig: {
      ...signinFields.password.inputConfig,
      label: 'Mật khẩu mới',
    },
  },
  confirmPassword: {
    ...signinFields.password,
    inputConfig: {
      label: 'Lặp lại mật khẩu mới',
      type: 'password',
      name: 'confirmPassword',
    },
  },
};

const userPasswordFields = {
  password: {
    ...signinFields.password,
    label: 'Mật khẩu cũ',
  },
  newPassword: {
    ...resetFields.password,
  },
  confirmPassword: { ...resetFields.confirmPassword },
};

const userInfoFields = {
  displayName: {
    label: 'Tên hiển thị',
    name: 'displayName',
    type: 'text',
  },
  name: {
    label: 'Họ và tên',
    name: 'name',
    type: 'text',
    boxName: 'showName',
  },
  bio: {
    label: 'Giới thiệu',
    name: 'bio',
    type: 'text',
    boxName: 'showBio',
  },
  location: {
    label: 'Nơi sống',
    name: 'location',
    type: 'text',
    boxName: 'showLocation',
  },
  email: {
    ...signinFields.email,
    boxName: 'showEmail',
  },
  password: {
    ...signinFields.password,
    label: 'Mật khẩu cũ',
    isPasswordField: true,
  },
  newPassword: {
    ...resetFields.password,
    isPasswordField: true,
  },
  confirmPassword: { ...resetFields.confirmPassword, isPasswordField: true },
};

export {
  signupFields,
  resetFields,
  signinFields,
  userPasswordFields,
  userInfoFields,
  requestResetFields,
};
