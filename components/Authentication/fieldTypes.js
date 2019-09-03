export const signupFields = [
  {
    label: 'E-mail',
    type: 'email',
    name: 'email',
    placeholder: 'required',
  },
  {
    label: 'Name',
    type: 'name',
    name: 'name',
  },
  {
    label: 'Display Name',
    type: 'displayName',
    name: 'displayName',
  },
  {
    label: 'Password',
    type: 'password',
    name: 'password',
    placeholder: 'required',
  },
];

export const resetFields = [
  { ...signupFields[3] },
  {
    label: 'Confirm Password',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'required',
  },
];

export const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];
