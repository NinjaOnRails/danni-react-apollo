import React from 'react';
import { Button, Comment, Form, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import User from '../Authentication/User';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
import {
  QUERY_VIDEO_COMMENTS,
  CREATE_COMMENT_MUTATION,
} from './commentQueries';
import PleaseSignIn from '../Authentication/PleaseSignIn';

/* eslint-disable */
const user = ({ render }) => (
  <User>
    {({ data, loading }) => {
      const currentUser = data ? data.currentUser : null;
      return render({ currentUser, loading });
    }}
  </User>
);

const createCommentMutation = ({ commentInput, videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENT_MUTATION}
    variables={{
      video: videoId,
      text: commentInput,
    }}
    refetchQueries={[
      {
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
  >
    {(createComment, createCommentResult) => {
      return render({ createComment, createCommentResult });
    }}
  </Mutation>
);

const videoComments = ({ videoId, render }) => (
  <Query query={QUERY_VIDEO_COMMENTS} variables={{ video: videoId }}>
    {render}
  </Query>
);

const Composed = adopt({
  user,
  createCommentMutation,
  videoComments,
});
/* eslint-enable */

class CommentSection extends React.Component {
  state = {
    commentInput: '',
    commentInputValid: false,
  };

  onTextChange = ({ target: { value } }) => {
    this.setState({ commentInput: value, commentInputValid: value.length > 0 });
  };

  onCommentSubmit = async createComment => {
    const { data } = await createComment();
    if (data) this.setState({ commentInput: '' });
  };

  render() {
    const { commentInput, commentInputValid } = this.state;
    const { videoId, client } = this.props;
    return (
      <Composed videoId={videoId} commentInput={commentInput}>
        {({
          user: { currentUser },
          createCommentMutation: {
            createComment,
            createCommentResult: {
              error: createCommentError,
              loading: createCommentLoading,
            },
          },
          videoComments: {
            error: commentsLoadingError,
            loading: commentsLoading,
            data: { hideSigninToComment, comments },
          },
        }) => (
          <CommentSectionStyles>
            <Error error={commentsLoadingError} />
            <Error error={createCommentError} />
            {commentsLoading ? (
              <Loader active inline="centered" />
            ) : (
              <Comment.Group size="large">
                <PleaseSignIn
                  action="Comment"
                  minimalistic
                  hidden={hideSigninToComment}
                >
                  <Form
                    loading={createCommentLoading}
                    reply
                    onSubmit={() => {
                      if (commentInput.length > 0)
                        this.onCommentSubmit(createComment);
                    }}
                  >
                    <Form.TextArea
                      placeholder="Write a comment..."
                      onChange={this.onTextChange}
                      value={commentInput}
                      onClick={() =>
                        client.writeData({
                          data: { hideSigninToComment: false },
                        })
                      }
                    />
                    <Button
                      content="Add Comment"
                      primary
                      disabled={!commentInputValid}
                    />
                  </Form>
                </PleaseSignIn>
                {comments &&
                  comments.map(comment => (
                    <VideoComment
                      key={comment.id}
                      comment={comment}
                      videoId={videoId}
                      currentUser={currentUser}
                      client={client}
                    />
                  ))}
              </Comment.Group>
            )}
          </CommentSectionStyles>
        )}
      </Composed>
    );
  }
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
  client: PropTypes.object.isRequired,
};
export default CommentSection;
