import React from 'react';
import PropTypes from 'prop-types';
import {
  Comment,
  Icon,
  Form,
  Button,
  Loader,
  Message,
} from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import {
  UPDATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  CREATE_COMMENTREPLY_VOTE_MUTATION,
} from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import { StyledMessage, StyledHeader } from '../styles/AuthenticationStyles';
import SigninMinimalistic from '../Authentication/SigninMinimalistic';

/* eslint-disable */
const deleteCommentReplyMutation = ({ id, videoId, render, parentId }) => (
  <Mutation
    mutation={DELETE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id }}
    refetchQueries={[
      {
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      },
    ]}
    update={(proxy, { data: { deleteCommentReply } }) => {
      const data = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      const commentReplyId = deleteCommentReply.id;
      data.comments = data.comments.map(comment => {
        if (comment.id === parentId) {
          comment.reply = comment.reply.filter(
            reply => reply.id !== commentReplyId
          );
        }
        return comment;
      });
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data,
      });
    }}
    optimisticResponse={{
      __typename: 'Mutation',
      deleteCommentReply: {
        id,
        __typename: 'CommentReply',
      },
    }}
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

const createCommentReplyVoteMutation = ({
  render,
  id,
  parentId,
  videoId,
  currentUser,
}) => (
  <Mutation
    mutation={CREATE_COMMENTREPLY_VOTE_MUTATION}
    // refetchQueries={[
    //   {
    //     query: VIDEO_COMMENTS_QUERY,
    //     variables: { video: videoId },
    //   },
    // ]}
    update={(proxy, { data: { createCommentReplyVote: createVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
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
              } else if (
                existingVote &&
                existingVote.type !== createVote.type
              ) {
                reply.vote = reply.vote.map(commentReplyVote => {
                  if (commentReplyVote.user.id === currentUser.id) {
                    commentReplyVote.type = createVote.type;
                  }
                  return commentReplyVote;
                });
              } else if (
                existingVote &&
                existingVote.type === createVote.type
              ) {
                reply.vote = reply.vote.filter(
                  commentReplyVote =>
                    commentReplyVote.user.id !== currentUser.id
                );
              }
            }
            return reply;
          });
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
    voteClicked: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.currentUser && !this.props.currentUser) {
      this.setState({ showEditForm: false, voteClicked: false });
    }
  }

  formatTime = time => {
    return `${moment(time).fromNow('yy')} ago`;
  };

  onTextChange = e => {
    const { value } = e.target;
    this.setState({ editInput: value, editFormValid: value.length > 0 });
  };

  onClickEdit = () => {
    this.setState({ showEditForm: true });
  };

  onUpdateSubmit = async updateComment => {
    const { data } = await updateComment();
    if (data) this.setState({ showEditForm: false, editInput: '' });
  };

  onDeleteCommentReply = deleteCommentReply => {
    if (confirm('Are you sure you want to delete this reply?'))
      deleteCommentReply();
  };

  onVoteClick = (
    { target: { id: type } },
    currentUser,
    createCommentReplyVote,
    commentReply
  ) => {
    if (currentUser) {
      createCommentReplyVote({
        variables: { commentReply, type },
        optimisticResponse: {
          __typename: 'Mutation',
          createCommentReplyVote: {
            id: Math.round(Math.random() * -100000000),
            type,
            user: {
              id: currentUser.id,
              __typename: 'User',
            },
            __typename: 'CommentReplyVote',
          },
        },
      });
    } else {
      this.setState({ voteClicked: true });
    }
  };

  renderCommentReply = (
    {
      deleteCommentReply,
      deleteCommentReplyResult: {
        error: deleteCommentReplyError,
        loading: deleteCommentReplyLoading,
      },
    },
    {
      updateCommentReply,
      updateCommentReplyResult: {
        error: updateCommentReplyError,
        loading: updateCommentReplyLoading,
      },
    },
    {
      createCommentReplyVote,
      createCommentReplyVoteResult: {
        error: createCommentReplyVoteError,
        loading: createCommentReplyVoteLoading,
      },
    }
  ) => {
    const {
      onReplyClick,
      commentReply: { id, text, author, createdAt, vote },
      currentUser,
    } = this.props;

    const { showEditForm, editInput, editFormValid, voteClicked } = this.state;
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
        <Error error={deleteCommentReplyError} />
        <Error error={updateCommentReplyError} />
        <Error error={createCommentReplyVoteError} />
        {deleteCommentReplyLoading ? (
          <Loader active />
        ) : (
          <>
            {/* <Comment.Avatar src="" /> */}
            <Comment.Content>
              <Comment.Author as="a">
                {author ? author.displayName : 'deleted user'}
              </Comment.Author>
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
                  autoComplete="off"
                >
                  <Form.Input
                    onChange={this.onTextChange}
                    defaultValue={text}
                    autoComplete="off"
                  />
                  <Button
                    content="Update Comment"
                    primary
                    disabled={!editFormValid}
                  />
                  <Button
                    content="Cancel"
                    onClick={() => {
                      // if (
                      //   confirm(
                      //     'Are you sure you want to discard all changes?'
                      //   )
                      // )
                      this.setState({ showEditForm: false });
                    }}
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
                      id="UPVOTE"
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
                      onClick={e =>
                        this.onVoteClick(
                          e,
                          currentUser,
                          createCommentReplyVote,
                          id
                        )
                      }
                    />
                    <span>{voteCount} </span>
                    <Icon
                      id="DOWNVOTE"
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
                      onClick={e =>
                        this.onVoteClick(
                          e,
                          currentUser,
                          createCommentReplyVote,
                          id
                        )
                      }
                    />
                    <Comment.Action onClick={onReplyClick}>
                      Reply
                    </Comment.Action>
                    {currentUser && author && author.id === currentUser.id ? (
                      <>
                        <Comment.Action onClick={this.onClickEdit}>
                          Edit
                        </Comment.Action>
                        <Comment.Action
                          onClick={() =>
                            this.onDeleteCommentReply(deleteCommentReply)
                          }
                        >
                          Delete
                        </Comment.Action>
                      </>
                    ) : null}
                  </Comment.Actions>
                </>
              )}
            </Comment.Content>
            {!currentUser && voteClicked && (
              <>
                <StyledMessage>
                  <Message warning>
                    <StyledHeader>Please Sign In to vote</StyledHeader>
                  </Message>
                </StyledMessage>
                <SigninMinimalistic noRedirect />
              </>
            )}
          </>
        )}
      </Comment>
    );
  };

  render() {
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
    const { editInput } = this.state;
    return (
      <Composed
        editInput={editInput}
        videoId={videoId}
        id={id}
        parentId={parentId}
        currentUser={currentUser}
      >
        {({
          deleteCommentReplyMutation,
          updateCommentReplyMutation,
          createCommentReplyVoteMutation,
        }) => {
          return this.renderCommentReply(
            deleteCommentReplyMutation,
            updateCommentReplyMutation,
            createCommentReplyVoteMutation
          );
        }}
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
