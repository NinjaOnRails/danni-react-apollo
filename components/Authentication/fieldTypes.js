const signupFields = [
  {
    label: 'E-mail',
    type: 'email',
    name: 'email',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Tên',
    type: 'name',
    name: 'name',
    icon: 'user',
    placeholder: 'Name',
  },
  {
    label: 'Tên hiển thị',
    type: 'displayName',
    name: 'displayName',
    icon: 'user',
    placeholder: 'Display Name',
  },
  {
    label: 'Mật khẩu',
    type: 'password',
    name: 'password',
    placeholder: 'bắt buộc',
  },
];

const resetFields = [
  { ...signupFields[3] },
  {
    label: 'Lập lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];

export { signupFields, resetFields, signinFields };
