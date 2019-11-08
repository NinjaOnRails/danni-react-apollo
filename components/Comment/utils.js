const clearForm = (setFormEmpty, setFormInvalid) => {
  setFormEmpty('');
  setFormInvalid(false);
};

const onCommentFormChange = (e, setForm, setFormValid) => {
  const { value } = e.target;
  setFormValid(value.length > 0);
  setForm(value);
};

export { clearForm, onCommentFormChange };
