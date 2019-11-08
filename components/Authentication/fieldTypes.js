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
      type: 'text',
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
      label: 'Lặp lại m/k mới',
      type: 'password',
      name: 'confirmPassword',
    },
  },
};

const userPasswordFields = {
  password: {
    ...resetFields.password,
    inputConfig: {
      ...resetFields.password.inputConfig,
      label: 'Mật khẩu cũ',
    },
  },
  newPassword: {
    ...resetFields.password,
    inputConfig: {
      ...resetFields.password.inputConfig,
      name: 'newPassword',
    },
  },
  confirmPassword: { ...resetFields.confirmPassword },
};

const userInfoFields = {
  displayName: {
    inputConfig: { ...signupFields.displayName.inputConfig },
  },
  name: {
    inputConfig: {
      label: 'Họ và tên',
      name: 'name',
      type: 'text',
    },
    boxName: 'showName',
  },
  bio: {
    inputConfig: {
      label: 'Giới thiệu',
      name: 'bio',
      type: 'text',
    },
    boxName: 'showBio',
  },
  location: {
    inputConfig: {
      label: 'Nơi sống',
      name: 'location',
      type: 'text',
    },
    boxName: 'showLocation',
  },
  email: {
    inputConfig: { ...signinFields.email.inputConfig, boxName: 'showEmail' },
  },
};

export {
  signupFields,
  resetFields,
  signinFields,
  userPasswordFields,
  userInfoFields,
  requestResetFields,
};
