export const signupFields = [
  {
    label: 'E-mail',
    type: 'email',
    name: 'email',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Họ và tên',
    type: 'name',
    name: 'name',
    placeholder: 'bắt buộc',
  },
  {
    label: 'Tên hiển thị',
    type: 'displayName',
    name: 'displayName',
    placeholder: 'bắt buộc',
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
    label: 'Lặp lại mặt khẩu mới',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'bắt buộc',
  },
];

export const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];
