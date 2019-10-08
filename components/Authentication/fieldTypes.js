const signupFields = {
  email: {
    label: 'E-mail',
    type: 'email',
    name: 'email',
  },
  name: {
    label: 'Tên (không bắt buộc)',
    type: 'name',
    name: 'name',
    icon: 'user',
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
  confirmPassword: {
    label: 'Lặp lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
  },
};

const resetFields = {
  password: { ...signupFields.password, label: 'Mật khẩu mới' },
  confirmPassword: {
    label: 'Lặp lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
  },
};

const signinFields = {
  email: { ...signupFields.email },
  password: { ...signupFields.password },
};

export { signupFields, resetFields, signinFields };
