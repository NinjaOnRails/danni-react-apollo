import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';
import Error from '../UI/ErrorMessage';

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

class CommentForm extends React.Component {
  state = {
    commentInput: '',
    commentInputValid: false,
  };

  onChange = ({ target: { value } }) => {
    this.setState({
      commentInput: value,
      commentInputValid: value.length > 0,
    });
  };

  onCommentSubmit = async createComment => {
    const { currentUser, openAuthModal } = this.props;
    if (!currentUser) {
      openAuthModal();
    } else {
      const { data } = await createComment();
      if (data) this.setState({ commentInput: '', commentInputValid: false });
    }
  };

  renderCommentForm = (createCommentLoading, createComment) => {
    const { commentInput, commentInputValid } = this.state;
    return (
      <Form
        loading={createCommentLoading}
        reply
        onSubmit={() => {
          if (commentInput.length > 0) this.onCommentSubmit(createComment);
        }}
      >
        <Form.TextArea
          placeholder="Viết bình luận..."
          onChange={this.onChange}
          value={commentInput}
        />
        <Button content="Đăng" primary disabled={!commentInputValid} />
      </Form>
    );
  };

  render() {
    const { videoId } = this.props;
    const { commentInput } = this.state;
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
            {this.renderCommentForm(createCommentLoading, createComment)}
          </>
        )}
      </Composed>
    );
  }
}

CommentForm.propTypes = {
  videoId: PropTypes.string.isRequired,
  openAuthModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

CommentForm.defaultProps = {
  currentUser: null,
};

export default CommentForm;
