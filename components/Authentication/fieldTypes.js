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
    inputConfig: {
      label: 'Mật khẩu mới',
      type: 'password',
      name: 'password',
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
      label: 'Lặp lại m/k mới',
      type: 'password',
      name: 'confirmPassword',
    },
    validation: {
      required: true,
      minLength: 6,
    },
    modified: false,
    valid: false,
    value: '',
  },
};

const userPasswordFields = {
  password: {
    inputConfig: {
      label: 'Mật khẩu cũ',
      type: 'password',
      name: 'password',
    },
    validation: {
      required: true,
    },
    modified: false,
    valid: false,
    value: '',
  },
  newPassword: {
    inputConfig: {
      name: 'newPassword',
      label: 'Mật khẩu mới',
      type: 'password',
    },
    validation: {
      required: true,
      minLength: 6,
    },
    modified: false,
    valid: false,
    value: '',
    mustMatch: true,
  },
  confirmPassword: {
    inputConfig: {
      label: 'Lặp lại m/k mới',
      type: 'password',
      name: 'confirmPassword',
    },
    validation: {
      required: true,
      minLength: 6,
    },
    modified: false,
    valid: false,
    value: '',
    mustMatch: true,
  },
};

const userInfoFields = {
  displayName: {
    inputConfig: {
      label: 'Tên hiển thị',
      type: 'text',
      name: 'displayName',
    },
    validation: {
      required: true,
    },
    modified: false,
    valid: true,
  },
  name: {
    inputConfig: {
      label: 'Họ và tên',
      name: 'name',
      type: 'text',
    },
    boxName: 'showName',
    modified: false,
    valid: true,
  },
  bio: {
    inputConfig: {
      label: 'Giới thiệu',
      name: 'bio',
      type: 'text',
    },
    boxName: 'showBio',
    modified: false,
    valid: true,
  },
  location: {
    inputConfig: {
      label: 'Nơi sống',
      name: 'location',
      type: 'text',
    },
    boxName: 'showLocation',
    modified: false,
    valid: true,
  },
  email: {
    inputConfig: {
      label: 'E-mail',
      type: 'email',
      name: 'email',
    },
    boxName: 'showEmail',
    validation: {
      required: true,
      isEmail: true,
    },
    modified: false,
    valid: true,
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
