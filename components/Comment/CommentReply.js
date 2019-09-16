import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import moment from 'moment';
import Error from '../UI/ErrorMessage';
import {
  UPDATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  QUERY_VIDEO_COMMENTS,
} from './commentQueries';
/* eslint-disable */
const deleteCommentReplyMutation = ({
  videoId,
  parentCommentId,
  id,
  render,
}) => (
  <Mutation
    mutation={DELETE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id }}
    update={(proxy, { data: { deleteCommentReply } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: QUERY_VIDEO_COMMENTS,
        variables: { video: videoId },
      });
      data.comments = data.comments.map(comment => {
        const filteredComment = { ...comment };
        if (filteredComment.id === parentCommentId) {
          filteredComment.reply = filteredComment.reply.filter(reply => {
            return reply.id !== id;
          });
        }
        return filteredComment;
      });
      // Write our data back to the cache with the new comment in it
      proxy.writeQuery({
        query: QUERY_VIDEO_COMMENTS,
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

const updateCommentReplyMutation = ({ videoId, id, render, editInput }) => (
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
/* eslint-enable */

const Composed = adopt({
  deleteCommentReplyMutation,
  updateCommentReplyMutation,
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

  onUpdateCommentReply = async updateCommentReply => {
    const { data } = await updateCommentReply();
    if (data) this.setState({ showEditForm: false, editInput: '' });
  };

  onDeleteCommentReply = async deleteCommentReply => {
    if (confirm('Are you sure you want to delete this comment?'))
      deleteCommentReply();
  };

  renderCommentReply(
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
    }
  ) {
    const {
      currentUser,
      onReplyClick,
      commentReply: { text, author, createdAt, downvoteCount, upvoteCount },
    } = this.props;
    const { showEditForm, editFormValid } = this.state;
    return (
      <Comment>
        <Error error={deleteCommentReplyError} />
        <Error error={updateCommentReplyError} />
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
                this.onUpdateCommentReply(updateCommentReply);
              }}
            >
              <Form.Input onChange={this.onTextChange} defaultValue={text} />
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
                <Icon name="angle up" size="large" link />
                <span>{+upvoteCount - +downvoteCount} </span>
                <Icon name="angle down" size="large" link />
                <Comment.Action onClick={onReplyClick}>Reply</Comment.Action>
                {currentUser && author.id === currentUser.id ? (
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
      </Comment>
    );
  }

  render() {
    const {
      commentReply: {
        id,

        comment: {
          id: parentCommentId,
          video: { id: videoId },
        },
      },
    } = this.props;
    const { editInput } = this.state;
    return (
      <Composed
        id={id}
        parentCommentId={parentCommentId}
        editInput={editInput}
        videoId={videoId}
      >
        {({ deleteCommentReplyMutation, updateCommentReplyMutation }) => {
          return this.renderCommentReply(
            deleteCommentReplyMutation,
            updateCommentReplyMutation
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
