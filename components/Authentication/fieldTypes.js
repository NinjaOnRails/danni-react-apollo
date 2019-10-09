const signupFields = {
  email: {
    label: 'E-mail',
    type: 'email',
    name: 'email',
  },
  displayName: {
    label: 'Tên hiển thị',
    type: 'displayName',
    name: 'displayName',
    icon: 'user',
  },
  password: {
    label: 'Mật khẩu',
    type: 'password',
    name: 'password',
  },
};

const resetFields = {
  password: {
    ...signupFields.password,
    label: 'Mật khẩu mới',
  },
  confirmPassword: {
    label: 'Lặp lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
  },
};

const signinFields = {
  email: { ...signupFields.email },
  password: { ...signupFields.password, label: 'Mật khẩu' },
};

export { signupFields, resetFields, signinFields };
