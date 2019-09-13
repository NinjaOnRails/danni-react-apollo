import React from 'react';
import { Button, Comment, Form, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
import {
  QUERY_VIDEO_COMMENTS,
  CREATE_COMMENT_MUTATION,
} from './commentQueries';

class CommentSection extends React.Component {
  state = {
    commentInput: '',
    commentInputValid: false,
  };

  onTextChange = e => {
    const { value } = e.target;
    this.setState({ commentInput: value, commentInputValid: value > 0 });
  };

  onSubmitComment = async callback => {
    const { data } = await callback();
    if (data) this.setState({ commentInput: '' });
  };

  render() {
    const { commentInput, commentInputValid } = this.state;
    const { videoId } = this.props;
    return (
      <Query query={QUERY_VIDEO_COMMENTS} variables={{ video: videoId }}>
        {({
          error: commentsLoadingError,
          loading: commentsLoading,
          data: { comments },
        }) => (
          <Mutation
            mutation={CREATE_COMMENT_MUTATION}
            variables={{
              video: videoId,
              text: commentInput,
            }}
            refetchQueries={[
              { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
            ]}
          >
            {(
              createComment,
              { error: createCommentError, loading: createCommentLoading }
            ) => {
              return (
                <CommentSectionStyles>
                  <Error error={commentsLoadingError} />
                  <Error error={createCommentError} />
                  {commentsLoading ? (
                    <Loader active inline="centered" />
                  ) : (
                    <Comment.Group size="large">
                      <Form
                        loading={createCommentLoading}
                        reply
                        onSubmit={() => {
                          if (commentInput.length > 0)
                            this.onSubmitComment(createComment);
                        }}
                      >
                        <Form.TextArea
                          placeholder="Viết bình luận..."
                          onChange={this.onTextChange}
                          value={commentInput}
                        />
                        <Button
                          content="Add Comment"
                          primary={commentInput.length > 0}
                          disabled={commentInputValid}
                        />
                      </Form>
                      {comments &&
                        comments.map(comment => (
                          <VideoComment
                            key={comment.id}
                            comment={comment}
                            videoId={videoId}
                          />
                        ))}
                    </Comment.Group>
                  )}
                </CommentSectionStyles>
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
};
export default CommentSection;
