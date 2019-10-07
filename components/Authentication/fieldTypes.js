const signupFields = [
  {
    label: 'E-mail (bắt buộc)',
    type: 'email',
    name: 'email',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Tên',
    type: 'name',
    name: 'name',
    icon: 'user',
  },
  {
    label: 'Tên hiển thị',
    type: 'displayName',
    name: 'displayName',
    icon: 'user',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Mật khẩu (bắt buộc)',
    type: 'password',
    name: 'password',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Lặp lại mật khẩu (bắt buộc)',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

const resetFields = [
  { ...signupFields[3], label: 'Mật khẩu mới' },
  {
    label: 'Lập lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];

export { signupFields, resetFields, signinFields };
