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
} from '../../graphql/mutation';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';

/* eslint-disable */
const deleteCommentReplyMutation = ({ id, videoId, render }) => (
  <Mutation
    mutation={DELETE_COMMENTREPLY_MUTATION}
    variables={{ commentReply: id }}
    refetchQueries={[
      {
        query: VIDEO_COMMENTS_QUERY,
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
        downvoteCount,
        upvoteCount,
      },
      currentUser,
    } = this.props;
    const { showEditForm, editInput, editFormValid } = this.state;
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
                        <Icon name="angle up" size="large" link />
                        <span>{+upvoteCount - +downvoteCount} </span>
                        <Icon name="angle down" size="large" link />
                        <Comment.Action onClick={onReplyClick}>
                          Reply
                        </Comment.Action>
                        {currentUser &&
                        author &&
                        author.id === currentUser.id ? (
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
