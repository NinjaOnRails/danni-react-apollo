import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import {
  useUpdateCommentMutation,
  useUpdateCommentReplyMutation,
} from './commentHooks';

const CommentUpdateForm = ({
  id,
  videoId,
  defaultText,
  closeEditInput,
  commentType,
}) => {
  const [text, setText] = useState('');
  const [updateCommentFormValid, setUpdateCommentFormValid] = useState(false);

  const [
    updateComment,
    { error: updateCommentError, loading: updateCommentLoading },
  ] = useUpdateCommentMutation({ id, text, videoId });
  const [
    updateCommentReply,
    { error: updateCommentReplyError, loading: updateCommentReplyLoading },
  ] = useUpdateCommentReplyMutation({ id, text, videoId });

  const onCommentUpdate = async commentMutationCallback => {
    const { data } = await commentMutationCallback();
    if (data) {
      closeEditInput();
    }
  };

  const onChange = ({ target: { value } }) => {
    setText(value);
    setUpdateCommentFormValid(value.length > 0);
  };

  return (
    <Form
      autoComplete="off"
      loading={updateCommentLoading || updateCommentReplyLoading}
      reply
      onSubmit={() => {
        if (commentType === 'comment') {
          onCommentUpdate(updateComment);
        } else if (commentType === 'commentReply') {
          onCommentUpdate(updateCommentReply);
        }
      }}
    >
      <Form.Input
        name="updateInput"
        onChange={onChange}
        defaultValue={defaultText}
        autoComplete="off"
      />
      <Button
        content="Sửa bình luận"
        primary
        disabled={!updateCommentFormValid}
      />
      <Button content="Huỷ" onClick={closeEditInput} />
      <Error error={updateCommentError || updateCommentReplyError} />
    </Form>
  );
};

CommentUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeEditInput: PropTypes.func.isRequired,
  defaultText: PropTypes.string.isRequired,
  commentType: PropTypes.string.isRequired,
};

export default CommentUpdateForm;
