export const signupFields = [
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
  },
  {
    label: 'Tên hiển thị',
    type: 'displayName',
    name: 'displayName',
  },
  {
    label: 'Mật khẩu',
    type: 'password',
    name: 'password',
    placeholder: 'bắt buộc',
  },
];

export const resetFields = [
  { ...signupFields[3] },
  {
    label: 'Lập lại mật khẩu',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

export const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];
