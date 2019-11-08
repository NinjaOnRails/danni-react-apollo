import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { CREATE_COMMENTREPLY_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import { clearForm, onCommentFormChange } from './utils';
/* eslint-disable */

const createCommentReplyMutation = ({ id, replyInput, videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENTREPLY_MUTATION}
    variables={{ comment: id, text: replyInput }}
    refetchQueries={[
      { query: VIDEO_COMMENTS_QUERY, variables: { video: videoId } },
    ]}
  >
    {(createCommentReply, createCommentReplyResult) => {
      return render({ createCommentReply, createCommentReplyResult });
    }}
  </Mutation>
);

/* eslint-enable */

const Composed = adopt({
  createCommentReplyMutation,
});

const CommentReplyForm = ({ id, videoId, closeReplyInput }) => {
  const [replyFormValid, setReplyFormValid] = useState(false);
  const [replyInput, setReplyInput] = useState('');

  const onReplySubmit = async createCommentReply => {
    const { data } = await createCommentReply();
    if (data) {
      clearForm(setReplyInput, setReplyFormValid);
      closeReplyInput();
    }
  };

  const renderReplyForm = ({
    createCommentReply,
    createCommentReplyResult: {
      error: createCommentReplyError,
      loading: createReplyLoading,
    },
  }) => {
    return (
      <Form
        loading={createReplyLoading}
        reply
        onSubmit={() => {
          onReplySubmit(createCommentReply);
        }}
        autoComplete="off"
      >
        <Form.Input
          name="replyInput"
          placeholder="Viết trả lời..."
          onChange={e =>
            onCommentFormChange(e, setReplyInput, setReplyFormValid)
          }
          value={replyInput}
          autoComplete="off"
        />
        <Error error={createCommentReplyError} />
        <Button content="Đăng" primary disabled={!replyFormValid} />
      </Form>
    );
  };

  return (
    <Composed replyInput={replyInput} id={id} videoId={videoId}>
      {({ createCommentReplyMutation }) => {
        return renderReplyForm(createCommentReplyMutation);
      }}
    </Composed>
  );
};

CommentReplyForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeReplyInput: PropTypes.func.isRequired,
};

export default CommentReplyForm;
