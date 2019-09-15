import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import CommentReply from './CommentReply';
import Error from '../UI/ErrorMessage';
import User from '../Authentication/User';
import {
  CREATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENT_MUTATION,
  QUERY_VIDEO_COMMENTS,
  UPDATE_COMMENT_MUTATION,
} from './commentQueries';

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

  render() {
    const {
      updateInput,
      replyInput,
      showReplyInput,
      showEditInput,
      updateCommentFormValid,
      replyFormValid,
    } = this.state;
    const {
      comment: {
        id,
        text,
        author,
        reply,
        createdAt,
        upvoteCount,
        downvoteCount,
      },
      videoId,
    } = this.props;
    return (
      <User>
        {({ data }) => {
          const currentUser = data ? data.currentUser : null;
          return (
            <Mutation
              mutation={CREATE_COMMENTREPLY_MUTATION}
              variables={{ comment: id, text: replyInput }}
              refetchQueries={[
                { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
              ]}
            >
              {(
                createCommentReply,
                { error: createCommentReplyError, loading: createReplyLoading }
              ) => (
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
                  {(
                    deleteComment,
                    { error: deleteCommentError, loading: deleteCommentLoading }
                  ) => (
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
                      {(
                        updateComment,
                        {
                          error: updateCommentError,
                          loading: updateCommentLoading,
                        }
                      ) => (
                        <Comment>
                          <Error error={createCommentReplyError} />
                          <Error error={deleteCommentError} />
                          <Error error={updateCommentError} />
                          {deleteCommentLoading ? (
                            <Loader active />
                          ) : (
                            <>
                              {/* <Comment.Avatar src="" /> */}
                              <Comment.Content>
                                <Comment.Author as="a">
                                  {author.displayName}
                                </Comment.Author>
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
                                      onClick={() =>
                                        this.setState({ showEditInput: false })
                                      }
                                    />
                                  </Form>
                                ) : (
                                  <>
                                    <Comment.Text>
                                      <p>{text}</p>
                                    </Comment.Text>
                                    <Comment.Actions>
                                      <Icon name="angle up" size="large" link />
                                      <span>
                                        {+upvoteCount - +downvoteCount}
                                      </span>
                                      <Icon
                                        name="angle down"
                                        size="large"
                                        link
                                      />
                                      <Comment.Action
                                        onClick={this.onReplyClick}
                                      >
                                        Reply
                                      </Comment.Action>
                                      {currentUser &&
                                      author.id === currentUser.id ? (
                                        <>
                                          <Comment.Action
                                            onClick={this.onEditClick}
                                          >
                                            Edit
                                          </Comment.Action>
                                          <Comment.Action
                                            onClick={deleteComment}
                                          >
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
                                    />
                                  ))}
                                </Comment.Group>
                              )}
                              {showReplyInput && (
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
                                  <Button
                                    content="Add Reply"
                                    primary
                                    disabled={!replyFormValid}
                                  />
                                </Form>
                              )}
                            </>
                          )}
                        </Comment>
                      )}
                    </Mutation>
                  )}
                </Mutation>
              )}
            </Mutation>
          );
        }}
      </User>
    );
  }
}

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
};

export default VideoComment;
