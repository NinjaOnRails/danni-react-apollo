import React, { useState } from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';
import Error from '../UI/ErrorMessage';
import { clearForm, onCommentFormChange } from './utils';
/* eslint-disable */
const createCommentMutation = ({ commentInput, videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENT_MUTATION}
    variables={{
      video: videoId,
      text: commentInput,
    }}
    refetchQueries={[
      {
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      },
    ]}
  >
    {(createComment, createCommentResult) => {
      return render({ createComment, createCommentResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  user,
  createCommentMutation,
});

const CommentForm = ({ videoId, openAuthModal, currentUser }) => {
  const [commentInput, setCommentInput] = useState('');
  const [commentInputValid, setCommentInputValid] = useState(false);

  const onCommentSubmit = async createComment => {
    if (!currentUser) {
      openAuthModal();
    } else {
      const { data } = await createComment();
      if (data) {
        clearForm(setCommentInput, setCommentInputValid);
      }
    }
  };

  const renderCommentForm = (createCommentLoading, createComment) => {
    return (
      <Form
        loading={createCommentLoading}
        reply
        onSubmit={() => {
          if (commentInput.length > 0) onCommentSubmit(createComment);
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
    );
  };

  return (
    <Composed videoId={videoId} commentInput={commentInput}>
      {({
        createCommentMutation: {
          createComment,
          createCommentResult: {
            error: createCommentError,
            loading: createCommentLoading,
          },
        },
      }) => (
        <>
          <Error error={createCommentError} />
          {renderCommentForm(createCommentLoading, createComment)}
        </>
      )}
    </Composed>
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
