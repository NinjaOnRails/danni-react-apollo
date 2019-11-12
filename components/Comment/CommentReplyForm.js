import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { clearForm, onCommentFormChange } from './utils';
import { useCreateCommentReplyMutation } from './commentHooks';

const CommentReplyForm = ({ id, videoId, closeReplyInput }) => {
  const [replyFormValid, setReplyFormValid] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  const {
    createCommentReply,
    data: { error, loading },
  } = useCreateCommentReplyMutation({ id, text: replyInput, videoId });

  const onReplySubmit = async () => {
    const { data } = await createCommentReply();
    if (data) {
      clearForm(setReplyInput, setReplyFormValid);
      closeReplyInput();
    }
  };

  return (
    <Form
      loading={loading}
      reply
      onSubmit={() => {
        onReplySubmit(createCommentReply);
      }}
      autoComplete="off"
    >
      <Form.Input
        name="replyInput"
        placeholder="Viết trả lời..."
        onChange={e => onCommentFormChange(e, setReplyInput, setReplyFormValid)}
        value={replyInput}
        autoComplete="off"
      />
      <Error error={error} />
      <Button content="Đăng" primary disabled={!replyFormValid} />
    </Form>
  );
};

CommentReplyForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeReplyInput: PropTypes.func.isRequired,
};

export default CommentReplyForm;
