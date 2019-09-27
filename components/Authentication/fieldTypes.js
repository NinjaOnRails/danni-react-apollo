const signupFields = [
  {
    label: 'E-mail',
    type: 'email',
    name: 'email',
    icon: 'mail',
    placeholder: 'required',
  },
  {
    label: 'Name',
    type: 'name',
    name: 'name',
    icon: 'user',
    placeholder: 'Name',
  },
  {
    label: 'Display Name',
    type: 'displayName',
    name: 'displayName',
    icon: 'user',
    placeholder: 'Display Name',
  },
  {
    label: 'Password',
    type: 'password',
    name: 'password',
    icon: 'lock',
    placeholder: 'required',
  },
];

const resetFields = [
  { ...signupFields[3] },
  {
    label: 'Confirm Password',
    type: 'password',
    name: 'confirmPassword',
    placeholder: 'required',
  },
];

const signinFields = [{ ...signupFields[0] }, { ...signupFields[3] }];

const modalLoginForm = {
  headerText: 'Login to your account',
  forms: [...signinFields],
  buttonText: 'Login',
};

const modalSignupForm = {
  headerText: 'Create a new account',
  forms: [...signupFields],
  buttonText: 'Sign Up',
};

export {
  signupFields,
  resetFields,
  signinFields,
  modalLoginForm,
  modalSignupForm,
};
