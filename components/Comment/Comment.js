import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { adopt } from 'react-adopt';
import CommentReplyForm from './CommentReplyForm';
import Error from '../UI/ErrorMessage';
import {
  DELETE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  CREATE_COMMENT_VOTE_MUTATION,
} from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import CommentReplyList from './CommentReplyList';
import PleaseSignIn from '../Authentication/PleaseSignIn';

/* eslint-disable */
const deleteCommentMutation = ({ id, videoId, render }) => (
  <Mutation
    mutation={DELETE_COMMENT_MUTATION}
    variables={{ comment: id }}
    // refetchQueries={[
    //   {
    //     query: VIDEO_COMMENTS_QUERY,
    //     variables: { video: videoId },
    //   },
    // ]}
    update={(proxy, { data: { deleteComment } }) => {
      const data = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      data.comments = data.comments.filter(
        comment => comment.id !== deleteComment.id
      );
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data,
      });
    }}
    optimisticResponse={{
      __typename: 'Mutation',
      deleteComment: {
        id,
        __typename: 'Comment',
      },
    }}
  >
    {(deleteComment, deleteCommentResult) => {
      return render({ deleteComment, deleteCommentResult });
    }}
  </Mutation>
);

const updateCommentMutation = ({ id, updateInput, videoId, render }) => (
  <Mutation
    mutation={UPDATE_COMMENT_MUTATION}
    variables={{ comment: id, text: updateInput }}
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

const createCommentVoteMutation = ({ videoId, render, id, currentUser }) => (
  <Mutation
    mutation={CREATE_COMMENT_VOTE_MUTATION}
    // refetchQueries={[
    //   {
    //     query: VIDEO_COMMENTS_QUERY,
    //     variables: { video: videoId },
    //   },
    // ]}
    update={(proxy, { data: { createCommentVote: createVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      const votingComment = data.comments.find(comment => comment.id === id);
      const existingVote =
        votingComment.vote.length > 0
          ? votingComment.vote.find(vote => vote.user.id === currentUser.id)
          : null;
      data.comments = data.comments.map(comment => {
        if (comment.id === votingComment.id) {
          if (!existingVote) {
            comment.vote = comment.vote.concat([createVote]);
          } else if (existingVote && existingVote.type !== createVote.type) {
            comment.vote = comment.vote.map(commentVote => {
              if (commentVote.user.id === currentUser.id) {
                commentVote.type = createVote.type;
              }
              return commentVote;
            });
          } else if (existingVote && existingVote.type === createVote.type) {
            comment.vote = comment.vote.filter(
              commentVote => commentVote.user.id !== currentUser.id
            );
          }
        }
        return comment;
      });
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data,
      });
    }}
  >
    {(createCommentVote, createCommentVoteResult) => {
      return render({ createCommentVote, createCommentVoteResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  deleteCommentMutation,
  updateCommentMutation,
  createCommentVoteMutation,
});

class VideoComment extends React.Component {
  state = {
    showReplyInput: false,
    showEditInput: false,
    updateCommentFormValid: true,
    voteClicked: false,
  };

  componentDidUpdate(prevProps) {
    // Reset state on signout
    if (prevProps.currentUser && !this.props.currentUser) {
      this.setState({
        showEditInput: false,
        showReplyInput: false,
        voteClicked: false,
      });
    }
  }

  formatTime = time => {
    return `${moment(time).fromNow('yy')} ago`;
  };

  onTextChange = e => {
    const { value, name } = e.target;
    const form =
      name === 'updateInput' ? 'updateCommentFormValid' : 'replyFormValid';

    this.setState({ [name]: value, [form]: value.length > 0 });
  };

  onReplyClick = () => {
    this.setState({ showReplyInput: true });
  };

  onEditClick = () => {
    this.setState({ showEditInput: true });
  };

  closeReplyInput = () => {
    this.setState({ showReplyInput: false });
  };

  onCommentUpdate = async updateComment => {
    const { data } = await updateComment();
    if (data)
      this.setState({
        showEditInput: false,
        updateInput: '',
      });
  };

  onDeleteComment = deleteComment => {
    if (confirm('Are you sure you want to delete this comment?'))
      deleteComment();
  };

  onVoteClick = (type, comment, createCommentVote) => {
    const { currentUser } = this.props;
    if (currentUser) {
      createCommentVote({
        variables: { comment, type },
        optimisticResponse: {
          __typename: 'Mutation',
          createCommentVote: {
            id: Math.round(Math.random() * -100000000),
            type,
            user: { id: currentUser.id, __typename: 'User' },
            __typename: 'CommentVote',
          },
        },
      });
    } else {
      this.setState({ voteClicked: true });
    }
  };

  renderComment(
    {
      deleteComment,
      deleteCommentResult: {
        error: deleteCommentError,
        loading: deleteCommentLoading,
      },
    },
    {
      updateComment,
      updateCommentResult: {
        error: updateCommentError,
        loading: updateCommentLoading,
      },
    },
    {
      createCommentVote,
      createCommentVoteResult: {
        error: createCommentVoteError,
        loading: createCommentVoteLoading,
      },
    }
  ) {
    const {
      showReplyInput,
      showEditInput,
      updateCommentFormValid,
      voteClicked,
    } = this.state;

    const {
      currentUser,
      comment: { id, text, author, reply, createdAt, vote },
      videoId,
    } = this.props;
    let voteType = null;
    let voteCount = 0;
    if (vote.length > 0) {
      voteCount = vote.reduce((total, commentVote) => {
        const i = commentVote.type === 'UPVOTE' ? 1 : -1;
        return total + i;
      }, 0);
      if (currentUser)
        voteType = vote.find(
          commentVote => commentVote.user.id === currentUser.id
        );
    }
    return (
      <Comment>
        <Error error={deleteCommentError} />
        <Error error={updateCommentError} />
        <Error error={deleteCommentError} />
        {deleteCommentLoading ? (
          <Loader active />
        ) : (
          <>
            <Comment.Avatar
              src={
                author.avatar ||
                'https://react.semantic-ui.com/images/avatar/small/steve.jpg'
              }
            />
            <Comment.Content>
              <Comment.Author as="a">
                {author ? author.displayName : <i>deleted user</i>}
              </Comment.Author>
              <Comment.Metadata>
                <div>{this.formatTime(createdAt)}</div>
              </Comment.Metadata>
              {showEditInput ? (
                <Form
                  autoComplete="off"
                  loading={updateCommentLoading}
                  reply
                  onSubmit={() => {
                    this.onCommentUpdate(updateComment);
                  }}
                >
                  <Form.Input
                    name="updateInput"
                    onChange={this.onTextChange}
                    defaultValue={text}
                    autoComplete="off"
                  />
                  <Button
                    content="Update Comment"
                    primary
                    disabled={!updateCommentFormValid}
                  />
                  <Button
                    content="Cancel"
                    onClick={() => {
                      // if (
                      //   confirm('Are you sure you want to discard all changes?')
                      // )
                      this.setState({ showEditInput: false });
                    }}
                  />
                </Form>
              ) : (
                <>
                  <Comment.Text>
                    <p>{text}</p>
                  </Comment.Text>
                  <Comment.Actions>
                    <Icon
                      id="UPVOTE"
                      name="angle up"
                      color={
                        voteType && voteType.type === 'UPVOTE'
                          ? 'orange'
                          : 'grey'
                      }
                      size="large"
                      link
                      disabled={
                        createCommentVoteLoading || createCommentVoteError
                      }
                      onClick={e =>
                        this.onVoteClick(e.target.id, id, createCommentVote)
                      }
                    />
                    <span>{voteCount}</span>
                    <Icon
                      id="DOWNVOTE"
                      name="angle down"
                      disabled={
                        createCommentVoteLoading || createCommentVoteError
                      }
                      color={
                        voteType && voteType.type === 'DOWNVOTE'
                          ? 'purple'
                          : 'grey'
                      }
                      size="large"
                      link
                      onClick={e =>
                        this.onVoteClick(e.target.id, id, createCommentVote)
                      }
                    />
                    <Comment.Action onClick={this.onReplyClick}>
                      Trả lời
                    </Comment.Action>
                    {currentUser && author && author.id === currentUser.id ? (
                      <>
                        <Comment.Action onClick={this.onEditClick}>
                          Sửa
                        </Comment.Action>
                        <Comment.Action
                          onClick={() => this.onDeleteComment(deleteComment)}
                        >
                          Xoá
                        </Comment.Action>
                      </>
                    ) : null}
                  </Comment.Actions>
                </>
              )}
            </Comment.Content>

            {voteClicked && <PleaseSignIn />}
            {reply.length > 0 && (
              <CommentReplyList
                reply={reply}
                currentUser={currentUser}
                onReplyClick={this.onReplyClick}
              />
            )}

            {showReplyInput && (
              <CommentReplyForm
                closeReplyInput={this.closeReplyInput}
                showReplyInput={showReplyInput}
                id={id}
                videoId={videoId}
              />
            )}
          </>
        )}
      </Comment>
    );
  }

  render() {
    const { updateInput, replyInput } = this.state;
    const {
      comment: { id },
      videoId,
      currentUser,
    } = this.props;
    return (
      <Composed
        updateInput={updateInput}
        replyInput={replyInput}
        id={id}
        videoId={videoId}
        currentUser={currentUser}
      >
        {({
          deleteCommentMutation,
          updateCommentMutation,
          createCommentVoteMutation,
        }) => {
          return this.renderComment(
            deleteCommentMutation,
            updateCommentMutation,
            createCommentVoteMutation
          );
        }}
      </Composed>
    );
  }
}

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

VideoComment.defaultProps = {
  currentUser: null,
};

export default VideoComment;
