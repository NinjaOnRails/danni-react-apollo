const signupFields = {
  email: {
    label: 'E-mail (bắt buộc)',
    type: 'email',
    name: 'email',
    placeholder: 'bắt buộc',
  },
  name: {
    label: 'Tên',
    type: 'name',
    name: 'name',
    icon: 'user',
  },
  displayName: {
    label: 'Tên hiển thị (bắt buộc)',
    type: 'displayName',
    name: 'displayName',
    icon: 'user',
    placeholder: 'bắt buộc',
  },
  password: {
    label: 'Mật khẩu (bắt buộc)',
    type: 'password',
    name: 'password',
    placeholder: 'bắt buộc',
  },
  confirmPassword: {
    label: 'Lặp lại mật khẩu (bắt buộc)',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
};

const resetFields = [
  { ...signupFields[3], label: 'Mật khẩu mới (bắt buộc)' },
  {
    label: 'Lập lại mật khẩu (bắt buộc)',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

const signinFields = [{ ...signupFields.email }, { ...signupFields.password }];

export { signupFields, resetFields, signinFields };
