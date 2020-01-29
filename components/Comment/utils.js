import moment from 'moment';

const clearForm = (setFormEmpty, setFormInvalid) => {
  setFormEmpty('');
  setFormInvalid(false);
};

const onCommentFormChange = (e, setForm, setFormValid) => {
  const { value } = e.target;
  setFormValid(value.length > 0);
  setForm(value);
};
const formatTime = time => {
  return `${moment(time).fromNow('yy')} ago`;
};
export { clearForm, onCommentFormChange, formatTime };