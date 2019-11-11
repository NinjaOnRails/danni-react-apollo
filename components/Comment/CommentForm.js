import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import { clearForm, onCommentFormChange } from './utils';
import { useCreateCommentMutation } from './CommentHooks';

const CommentForm = ({ videoId, openAuthModal, currentUser }) => {
  const [commentInput, setCommentInput] = useState('');
  const [commentInputValid, setCommentInputValid] = useState(false);

  const {
    createComment,
    data: { error: createCommentError, loading: createCommentLoading },
  } = useCreateCommentMutation(commentInput, videoId);
  const onCommentSubmit = async () => {
    if (!currentUser) {
      openAuthModal();
    } else {
      const { data } = await createComment();
      if (data) {
        clearForm(setCommentInput, setCommentInputValid);
      }
    }
  };

  return (
    <>
      <Error error={createCommentError} />
      <Form
        loading={createCommentLoading}
        reply
        onSubmit={() => {
          if (commentInput.length > 0) onCommentSubmit();
        }}
      >
        <Form.TextArea
          placeholder="Viết bình luận..."
          onChange={e =>
            onCommentFormChange(e, setCommentInput, setCommentInputValid)
          }
          value={commentInput}
        />
        <Button content="Đăng" primary disabled={!commentInputValid} />
      </Form>
    </>
  );
};

CommentForm.propTypes = {
  videoId: PropTypes.string.isRequired,
  openAuthModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

CommentForm.defaultProps = {
  currentUser: null,
};

export default CommentForm;
