import React from 'react';
import { Button, Comment, Form, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
import { CREATE_COMMENT_MUTATION } from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import PleaseSignIn from '../Authentication/PleaseSignIn';
import CommentList from './CommentList';
import { user } from '../UI/ContentLanguage';

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

const videoComments = ({ videoId, render }) => (
  <Query query={VIDEO_COMMENTS_QUERY} variables={{ video: videoId }}>
    {/* {videoComments => {
      return render({ videoComments });
    }} */}
    {render}
  </Query>
);
/* eslint-enable */

const Composed = adopt({
  user,
  createCommentMutation,
  videoComments,
});

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
    if (data) this.setState({ commentInput: '', commentInputValid: false });
  };

  renderComments = (data, createCommentLoading, createComment, currentUser) => {
    const { videoId, client } = this.props;
    const { commentInput, commentInputValid } = this.state;

    return (
      <CommentSectionStyles>
        {console.log('CommentSection')}
        <Comment.Group size="large">
          <PleaseSignIn
            action="Comment"
            minimalistic
            hidden={data.hideSigninToComment}
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
          {data.comments && (
            <CommentList
              comments={data.comments}
              videoId={videoId}
              client={client}
              currentUser={currentUser}
            />
          )}
        </Comment.Group>
      </CommentSectionStyles>
    );
  };

  render() {
    const { commentInput } = this.state;
    const { videoId } = this.props;
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
            data,
          },
        }) => (
          <>
            <Error error={commentsLoadingError} />
            <Error error={createCommentError} />
            {commentsLoading ? (
              <Loader active inline="centered" />
            ) : (
              this.renderComments(
                data,
                createCommentLoading,
                createComment,
                currentUser
              )
            )}
          </>
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
