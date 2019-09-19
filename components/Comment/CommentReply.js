import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import {
  UPDATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  QUERY_VIDEO_COMMENTS,
  CREATE_COMMENTREPLY_VOTE_MUTATION,
} from './commentQueries';

/* eslint-disable */
const deleteCommentReplyMutation = ({ id, videoId, render }) => (
  <Mutation
    mutation={DELETE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id }}
    // refetchQueries={[
    //   {
    //     query: QUERY_VIDEO_COMMENTS,
    //     variables: { video: videoId },
    //   },
    // ]}
  >
    {(deleteCommentReply, deleteCommentReplyResult) => {
      return render({ deleteCommentReply, deleteCommentReplyResult });
    }}
  </Mutation>
);

const updateCommentReplyMutation = ({ id, videoId, editInput, render }) => (
  <Mutation
    mutation={UPDATE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id, text: editInput }}
    refetchQueries={[
      {
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
  >
    {(updateCommentReply, updateCommentReplyResult) => {
      return render({ updateCommentReply, updateCommentReplyResult });
    }}
  </Mutation>
);

const createCommentReplyVoteMutation = ({ videoId, render }) => (
  <Mutation
    mutation={CREATE_COMMENTREPLY_VOTE_MUTATION}
    refetchQueries={[
      {
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
  >
    {(createCommentReplyVote, createCommentReplyVoteResult) => {
      return render({ createCommentReplyVote, createCommentReplyVoteResult });
    }}
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  deleteCommentReplyMutation,
  updateCommentReplyMutation,
  createCommentReplyVoteMutation,
});

class CommentReply extends React.Component {
  state = {
    showEditForm: false,
    editFormValid: true,
  };

  formatTime = time => {
    return `${moment(time).fromNow('yy')} ago`;
  };

  update = (proxy, { data: { createCommentReplyVote: createVote } }) => {
    const {
      commentReply: {
        id,
        comment: {
          id: parentId,
          video: { id: videoId },
        },
      },
      currentUser,
    } = this.props;
    // Read the data from our cache for this query.
    const data = proxy.readQuery({
      query: QUERY_VIDEO_COMMENTS,
      variables: { video: videoId },
    });
    const votingComment = data.comments.find(
      comment => comment.id === parentId
    );
    const votingReply = votingComment.reply.find(reply => reply.id === id);
    const existingVote =
      votingReply.vote.length > 0
        ? votingReply.vote.find(vote => vote.user.id === currentUser.id)
        : null;
    data.comments = data.comments.map(comment => {
      if (comment.id === votingComment.id) {
        comment.reply.map(reply => {
          if (reply.id === votingReply.id) {
            if (!existingVote) {
              reply.vote = reply.vote.concat([createVote]);
            } else if (existingVote && existingVote.type !== createVote.type) {
              reply.vote = reply.vote.map(commentReplyVote => {
                if (commentReplyVote.user.id === currentUser.id) {
                  commentReplyVote.type = createVote.type;
                }
                return commentReplyVote;
              });
            } else if (existingVote && existingVote.type === createVote.type) {
              reply.vote = reply.vote.filter(
                commentReplyVote => commentReplyVote.user.id !== currentUser.id
              );
            }
          }
          return reply;
        });
      }
      return comment;
    });
    proxy.writeQuery({
      query: QUERY_VIDEO_COMMENTS,
      variables: { video: videoId },
      data,
    });
  };

  onTextChange = e => {
    const { value } = e.target;
    this.setState({ editInput: value, editFormValid: value.length > 0 });
  };

  onClickEdit = () => {
    this.setState({ showEditForm: true });
  };

  onUpdateSubmit = async callback => {
    const { data } = await callback();
    if (data) this.setState({ showEditForm: false, editInput: '' });
  };

  render() {
    const {
      onReplyClick,
      commentReply: {
        id,
        text,
        author,
        comment: {
          video: { id: videoId },
        },
        createdAt,
        vote,
      },
      currentUser,
    } = this.props;
    const { showEditForm, editInput, editFormValid } = this.state;
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
      <Composed editInput={editInput} videoId={videoId} id={id}>
        {({
          deleteCommentReplyMutation: {
            deleteCommentReply,
            deleteCommentReplyResult: {
              error: deleteCommentReplyError,
              loading: deleteCommentReplyLoading,
            },
          },
          updateCommentReplyMutation: {
            updateCommentReply,
            updateCommentReplyResult: {
              error: updateCommentReplyError,
              loading: updateCommentReplyLoading,
            },
          },
          createCommentReplyVoteMutation: {
            createCommentReplyVote,
            createCommentReplyVoteResult: {
              error: createCommentReplyVoteError,
              loading: createCommentReplyVoteLoading,
            },
          },
        }) => (
          <Comment>
            <Error error={deleteCommentReplyError} />
            <Error error={updateCommentReplyError} />
            {deleteCommentReplyLoading ? (
              <Loader active inline="centered" />
            ) : (
              <>
                {/* <Comment.Avatar src="" /> */}
                <Comment.Content>
                  <Comment.Author as="a">{author.displayName}</Comment.Author>
                  <Comment.Metadata>
                    <div>{this.formatTime(createdAt)}</div>
                  </Comment.Metadata>
                  {showEditForm && (
                    <Form
                      loading={updateCommentReplyLoading}
                      reply
                      onSubmit={() => {
                        this.onUpdateSubmit(updateCommentReply);
                      }}
                    >
                      <Form.Input
                        onChange={this.onTextChange}
                        defaultValue={text}
                      />
                      <Button
                        content="Update Comment"
                        primary
                        disabled={!editFormValid}
                      />
                      <Button
                        content="Cancel"
                        onClick={() => this.setState({ showEditForm: false })}
                      />
                    </Form>
                  )}
                  {!showEditForm && (
                    <>
                      <Comment.Text>
                        <p>{text}</p>
                      </Comment.Text>
                      <Comment.Actions>
                        <Icon
                          name="angle up"
                          size="large"
                          link
                          disabled={
                            createCommentReplyVoteError ||
                            createCommentReplyVoteLoading
                          }
                          color={
                            voteType && voteType.type === 'UPVOTE'
                              ? 'orange'
                              : 'grey'
                          }
                          onClick={() =>
                            createCommentReplyVote({
                              variables: { commentReply: id, type: 'UPVOTE' },
                              optimisticResponse: {
                                __typename: 'Mutation',
                                createCommentReplyVote: {
                                  id: Math.round(Math.random() * -100000000),
                                  type: 'UPVOTE',
                                  user: {
                                    id: currentUser.id,
                                    __typename: 'User',
                                  },
                                  __typename: 'CommentReplyVote',
                                },
                              },
                              update: this.update,
                            })
                          }
                        />
                        <span>{voteCount} </span>
                        <Icon
                          name="angle down"
                          size="large"
                          link
                          disabled={
                            createCommentReplyVoteError ||
                            createCommentReplyVoteLoading
                          }
                          color={
                            voteType && voteType.type === 'DOWNVOTE'
                              ? 'purple'
                              : 'grey'
                          }
                          onClick={() =>
                            createCommentReplyVote({
                              variables: { commentReply: id, type: 'DOWNVOTE' },
                              optimisticResponse: {
                                __typename: 'Mutation',
                                createCommentReplyVote: {
                                  id: Math.round(Math.random() * -100000000),
                                  type: 'DOWNVOTE',
                                  user: {
                                    id: currentUser.id,
                                    __typename: 'User',
                                  },
                                  __typename: 'CommentReplyVote',
                                },
                              },
                              update: this.update,
                            })
                          }
                        />
                        <Comment.Action onClick={onReplyClick}>
                          Reply
                        </Comment.Action>
                        {currentUser && author.id === currentUser.id ? (
                          <>
                            <Comment.Action onClick={this.onClickEdit}>
                              Edit
                            </Comment.Action>
                            <Comment.Action onClick={deleteCommentReply}>
                              Delete
                            </Comment.Action>
                          </>
                        ) : null}
                      </Comment.Actions>
                    </>
                  )}
                </Comment.Content>
              </>
            )}
          </Comment>
        )}
      </Composed>
    );
  }
}

CommentReply.propTypes = {
  commentReply: PropTypes.object.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

CommentReply.defaultProps = {
  currentUser: null,
};

export default CommentReply;
