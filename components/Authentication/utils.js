export const validateInput = (value, rule) => {
  let isValid = true;
  if (!rule) {
    return true;
  }
  if (rule.required) {
    isValid = value.trim() !== '' && isValid;
  }
  if (rule.minLength) {
    isValid = value.length >= rule.minLength && isValid;
  }
  if (rule.maxLength) {
    isValid = value.length <= rule.maxLength && isValid;
  }
  if (rule.isEmail) {
    const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    isValid = pattern.test(value) && isValid;
  }
  return isValid;
};

export const inputChangeHandler = (
  e,
  input,
  authForm,
  setAuthForm,
  setFormValid
) => {
  const eventValue = e.target.value;
  const updatedForm = {
    ...authForm,
  };
  const updatedElement = {
    ...updatedForm[input],
  };
  updatedElement.value = eventValue;
  updatedElement.valid = validateInput(
    updatedElement.value,
    updatedElement.validation
  );
  updatedElement.modified = true;
  updatedForm[input] = updatedElement;
  let isFormValid = true;
  Object.keys(updatedForm).forEach(key => {
    isFormValid = updatedForm[key].valid && isFormValid;
  });
  setAuthForm(updatedForm);
  setFormValid(isFormValid);
};

export const clearForm = (initialForm, setInitialForm, setFormInvalid) => {
  setInitialForm({ ...initialForm });
  setFormInvalid(false);
};
