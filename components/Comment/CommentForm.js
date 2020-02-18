import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Form } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { clearForm, onCommentFormChange } from './utils';
import { useCreateCommentMutation } from './commentHooks';
import { useOpenAuthModalMutation } from '../UI/uiHooks';

const CommentForm = ({ videoId, currentUser }) => {
  const [commentInput, setCommentInput] = useState('');
  const [commentInputValid, setCommentInputValid] = useState(false);

  const [
    createComment,
    { error: createCommentError, loading: createCommentLoading },
  ] = useCreateCommentMutation({ text: commentInput, video: videoId });

  const [openAuthModal] = useOpenAuthModalMutation();

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
          placeholder="Write a comment..."
          onChange={e =>
            onCommentFormChange(e, setCommentInput, setCommentInputValid)
          }
          value={commentInput}
        />
        <Button content="Submit" primary disabled={!commentInputValid} />
      </Form>
    </>
  );
};

CommentForm.propTypes = {
  videoId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

CommentForm.defaultProps = {
  currentUser: null,
};

export default CommentForm;
