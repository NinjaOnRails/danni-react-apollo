import React from 'react';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import {
  UPDATE_COMMENTREPLY_MUTATION,
  UPDATE_COMMENT_MUTATION,
} from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import Error from '../UI/ErrorMessage';
// refactor
/* eslint-disable */
const updateCommentMutation = ({ id, videoId, text, render }) => (
  <Mutation
    mutation={UPDATE_COMMENT_MUTATION}
    variables={{ comment: id, text }}
    refetchQueries={[
      {
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      },
    ]}
  >
    {(updateComment, updateCommentResult) => {
      return render({ updateComment, updateCommentResult });
    }}
  </Mutation>
);

const updateCommentReplyMutation = ({ id, videoId, text, render }) => (
  <Mutation
    mutation={UPDATE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id, text }}
    refetchQueries={[
      {
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      },
    ]}
  >
    {(updateCommentReply, updateCommentReplyResult) => {
      return render({ updateCommentReply, updateCommentReplyResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  updateCommentMutation,
  updateCommentReplyMutation,
});

class CommentUpdateForm extends React.Component {
  state = {
    updateCommentFormValid: true,
  };

  onCommentUpdate = async updateComment => {
    const { closeEditInput } = this.props;
    const { data } = await updateComment();
    if (data) {
      closeEditInput();
    }
  };

  onChange = ({ target: { value } }) => {
    this.setState({
      text: value,
      updateCommentFormValid: value.length > 0,
    });
  };

  render() {
    const { text, updateCommentFormValid } = this.state;
    const {
      id,
      videoId,
      defaultText,
      closeEditInput,
      commentType,
    } = this.props;

    return (
      <Composed text={text} id={id} videoId={videoId}>
        {({
          updateCommentMutation: {
            updateComment,
            updateCommentResult: {
              error: updateCommentError,
              loading: updateCommentLoading,
            },
          },
          updateCommentReplyMutation: {
            updateCommentReply,
            updateCommentReplyResult: {
              error: updateCommentReplyError,
              loading: updateCommentReplyLoading,
            },
          },
        }) => (
          <Form
            autoComplete="off"
            loading={updateCommentLoading || updateCommentReplyLoading}
            reply
            onSubmit={() => {
              if (commentType === 'comment') {
                this.onCommentUpdate(updateComment);
              } else if (commentType === 'commentReply') {
                this.onCommentUpdate(updateCommentReply);
              }
            }}
          >
            <Form.Input
              name="updateInput"
              onChange={this.onChange}
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
        )}
      </Composed>
    );
  }
}

CommentUpdateForm.propTypes = {
  id: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
  closeEditInput: PropTypes.func.isRequired,
  defaultText: PropTypes.string.isRequired,
  commentType: PropTypes.string.isRequired,
};

export default CommentUpdateForm;
