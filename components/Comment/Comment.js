import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { adopt } from 'react-adopt';
import PleaseSignIn from '../Authentication/PleaseSignIn';
import CommentReply from './CommentReply';
import Error from '../UI/ErrorMessage';
import {
  CREATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENT_MUTATION,
  QUERY_VIDEO_COMMENTS,
  UPDATE_COMMENT_MUTATION,
  CREATE_COMMENT_VOTE_MUTATION,
} from './commentQueries';

/* eslint-disable */

const createCommentReplyMutation = ({ id, replyInput, videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENTREPLY_MUTATION}
    variables={{ comment: id, text: replyInput }}
    refetchQueries={[
      { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
    ]}
  >
    {(createCommentReply, createCommentReplyResult) => {
      return render({ createCommentReply, createCommentReplyResult });
    }}
  </Mutation>
);

const deleteCommentMutation = ({ id, videoId, render }) => (
  <Mutation
    mutation={DELETE_COMMENT_MUTATION}
    variables={{ comment: id }}
    refetchQueries={[
      {
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
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
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
  >
    {(updateComment, updateCommentResult) => {
      return render({ updateComment, updateCommentResult });
    }}
  </Mutation>
);

const createCommentVoteMutation = ({ videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENT_VOTE_MUTATION}
    // refetchQueries={[
    //   {
    //     query: QUERY_VIDEO_COMMENTS,
    //     variables: { video: videoId },
    //   },
    // ]}
  >
    {(createCommentVote, createCommentVoteResult) => {
      return render({ createCommentVote, createCommentVoteResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  createCommentReplyMutation,
  deleteCommentMutation,
  updateCommentMutation,
  createCommentVoteMutation,
});

class VideoComment extends React.Component {
  state = {
    showReplyInput: false,
    showEditInput: false,
    updateCommentFormValid: true,
    replyFormValid: false,
    replyInput: '',
  };

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

  onCommentUpdate = async updateComment => {
    const { data } = await updateComment();
    if (data) this.setState({ showEditInput: false, updateInput: '' });
  };

  onReplySubmit = async createCommentReply => {
    const { data } = await createCommentReply();
    if (data) this.setState({ replyInput: '', showReplyInput: false });
  };

  update = (proxy, { data: { createCommentVote: createVote } }) => {
    const {
      videoId,
      comment: { id },
      currentUser,
    } = this.props;
    // Read the data from our cache for this query.
    const data = proxy.readQuery({
      query: QUERY_VIDEO_COMMENTS,
      variables: { video: videoId },
    });

    const votingComment = data.comments.find(comment => comment.id === id);

    const existingVote =
      votingComment.vote.length > 0
        ? votingComment.vote.find(vote => vote.user.id === currentUser.id)
        : null;
    console.log('existingVote', existingVote);
    console.log('createVote', createVote);
    data.comments = data.comments.map(comment => {
      if (comment.id === id) {
        console.log('votes array before', comment.vote);

        if (!existingVote) {
          comment.vote = comment.vote.concat([createVote]);
        } else if (existingVote && existingVote.type !== createVote.type) {
          comment.vote = comment.vote.map(commentVote => {
            if (commentVote.user.id === currentUser.id) {
              commentVote.type = createVote.type;
              // commentVote = {
              //   ...commentVote,
              //   type: createVote.type,
              //   id: createVote.id,
              // };
              // commentVote.id = createVote.id;
            }
            return commentVote;
          });
        } else if (existingVote && existingVote.type === createVote.type) {
          comment.vote = comment.vote.filter(
            commentVote => commentVote.user.id !== currentUser.id
          );
        }
        console.log('votes array after', comment.vote);
      }
      return comment;
    });
console.log("--------------")
    proxy.writeQuery({
      query: QUERY_VIDEO_COMMENTS,
      variables: { video: videoId },
      data,
    });
  };

  renderComment(
    {
      createCommentReply,
      createCommentReplyResult: {
        error: createCommentReplyError,
        loading: createReplyLoading,
      },
    },
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
        networkStatus: createCommentVoteNetwork,
      },
    }
  ) {
    const {
      showReplyInput,
      showEditInput,
      updateCommentFormValid,
      replyFormValid,
      replyInput,
    } = this.state;

    const {
      currentUser,
      comment: { id, text, author, reply, createdAt, vote },
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
        {deleteCommentLoading ? (
          <Loader active />
        ) : (
          <>
            {/* <Comment.Avatar src="" /> */}
            <Comment.Content>
              <Comment.Author as="a">{author.displayName}</Comment.Author>
              <Comment.Metadata>
                <div>{this.formatTime(createdAt)}</div>
              </Comment.Metadata>
              {showEditInput ? (
                <Form
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
                  />
                  <Button
                    content="Update Comment"
                    primary
                    disabled={!updateCommentFormValid}
                  />
                  <Button
                    content="Cancel"
                    onClick={() => this.setState({ showEditInput: false })}
                  />
                </Form>
              ) : (
                <>
                  <Comment.Text>
                    <p>{text}</p>
                  </Comment.Text>
                  <Comment.Actions>
                    <Icon
                      name="angle up"
                      color={
                        voteType && voteType.type === 'UPVOTE'
                          ? 'orange'
                          : 'grey'
                      }
                      size="large"
                      link
                      disabled={createCommentVoteLoading}
                      onClick={() => {
                        createCommentVote({
                          variables: { comment: id, type: 'UPVOTE' },
                          optimisticResponse: {
                            __typename: 'Mutation',
                            createCommentVote: {
                              id: Math.round(Math.random() * -100000000),
                              type: 'UPVOTE',
                              user: { id: currentUser.id, __typename: 'User' },
                              __typename: 'CommentVote',
                            },
                          },
                          update: this.update,
                        });
                      }}
                    />
                    <span>{voteCount}</span>
                    <Icon
                      name="angle down"
                      disabled={createCommentVoteLoading}
                      color={
                        voteType && voteType.type === 'DOWNVOTE'
                          ? 'purple'
                          : 'grey'
                      }
                      size="large"
                      link
                      onClick={() =>
                        createCommentVote({
                          variables: { comment: id, type: 'DOWNVOTE' },
                          optimisticResponse: {
                            __typename: 'Mutation',
                            createCommentVote: {
                              id: Math.round(Math.random() * -100000000),
                              type: 'DOWNVOTE',
                              user: { id: currentUser.id, __typename: 'User' },
                              __typename: 'CommentVote',
                            },
                          },
                          update: this.update,
                        })
                      }
                    />
                    <Comment.Action onClick={this.onReplyClick}>
                      Reply
                    </Comment.Action>
                    {currentUser && author.id === currentUser.id ? (
                      <>
                        <Comment.Action onClick={this.onEditClick}>
                          Edit
                        </Comment.Action>
                        <Comment.Action onClick={deleteComment}>
                          Delete
                        </Comment.Action>
                      </>
                    ) : null}
                  </Comment.Actions>
                </>
              )}
            </Comment.Content>
            {reply.length > 0 && (
              <Comment.Group>
                {reply.map(commentReply => (
                  <CommentReply
                    key={commentReply.id}
                    commentReply={commentReply}
                    onReplyClick={this.onReplyClick}
                    currentUser={currentUser}
                  />
                ))}
              </Comment.Group>
            )}
            {showReplyInput && (
              <PleaseSignIn
                action="Reply"
                minimalistic
                hidden={!showReplyInput}
              >
                <Form
                  loading={createReplyLoading}
                  reply
                  onSubmit={() => {
                    this.onReplySubmit(createCommentReply);
                  }}
                >
                  <Form.Input
                    name="replyInput"
                    placeholder="Write a reply..."
                    onChange={this.onTextChange}
                    value={replyInput}
                  />
                  <Error error={createCommentReplyError} />
                  <Button
                    content="Add Reply"
                    primary
                    disabled={!replyFormValid}
                  />
                </Form>
              </PleaseSignIn>
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
    } = this.props;
    return (
      <Composed
        updateInput={updateInput}
        replyInput={replyInput}
        id={id}
        videoId={videoId}
      >
        {({
          createCommentReplyMutation,
          deleteCommentMutation,
          updateCommentMutation,
          createCommentVoteMutation,
        }) => {
          return this.renderComment(
            createCommentReplyMutation,
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
