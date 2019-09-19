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
    refetchQueries={[
      {
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      },
    ]}
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
                          color={
                            voteType && voteType.type === 'UPVOTE'
                              ? 'orange'
                              : 'grey'
                          }
                          onClick={() =>
                            createCommentReplyVote({
                              variables: { commentReply: id, type: 'UPVOTE' },
                            })
                          }
                        />
                        <span>{voteCount} </span>
                        <Icon
                          name="angle down"
                          size="large"
                          link
                          color={
                            voteType && voteType.type === 'DOWNVOTE'
                              ? 'purple'
                              : 'grey'
                          }
                          onClick={() =>
                            createCommentReplyVote({
                              variables: { commentReply: id, type: 'DOWNVOTE' },
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
