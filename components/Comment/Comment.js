import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import CommentReply from './CommentReply';
import Error from '../UI/ErrorMessage';
import User from '../Authentication/User';

const QUERY_VIDEO_COMMENTS = gql`
  query QUERY_VIDEO_COMMENTS($video: ID!) {
    comments(where: { video: { id: $video } }) {
      id
      text
      createdAt
      upvoteCount
      downvoteCount

      audio {
        id
      }

      author {
        id
        name
      }

      reply {
        id
        text
        createdAt
        upvoteCount
        downvoteCount
        comment {
          id
          video {
            id
          }
        }
        author {
          id
          name
        }
      }
    }
  }
`;

const CREATE_COMMENT_REPLY = gql`
  mutation CREATE_COMMENT_REPLY($comment: ID!, $text: String!) {
    createCommentReply(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

const UPDATE_COMMENT = gql`
  mutation UPDATE_COMMENT($comment: ID!, $text: String) {
    updateComment(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

const DELETE_COMMENT = gql`
  mutation DELETE_COMMENT($comment: ID!) {
    deleteComment(comment: $comment) {
      id
    }
  }
`;

class VideoComment extends React.Component {
  state = {
    showReplyInput: false,
    showEditInput: false,
  };

  formatTime = time => {
    return `${moment(time).fromNow('yy')} ago`;
  };

  onTextChange = e => {
    const { value, name } = e.target;
    this.setState({ [name]: value });
  };

  onReplyClick = () => {
    this.setState({ showReplyInput: true });
  };

  onEditClick = () => {
    this.setState({ showEditInput: true });
  };

  onCommentUpdate = async callback => {
    const { data } = await callback();
    if (data) this.setState({ showEditInput: false, updateInput: '' });
  };

  onReplySubmit = async callback => {
    const { data } = await callback();
    if (data) this.setState({ replyInput: '', showReplyInput: false });
  };

  render() {
    const {
      updateInput,
      replyInput,
      showReplyInput,
      showEditInput,
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
              mutation={CREATE_COMMENT_REPLY}
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
                  mutation={DELETE_COMMENT}
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
                      mutation={UPDATE_COMMENT}
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
                            <Loader active small />
                          ) : (
                            <Fragment>
                              <Comment.Avatar src="" />
                              <Comment.Content>
                                <Comment.Author as="a">
                                  {author.name}
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
                                    <Button content="Update Comment" primary />
                                    <Button
                                      content="Cancel"
                                      primary
                                      onClick={() =>
                                        this.setState({ showEditInput: false })
                                      }
                                    />
                                  </Form>
                                ) : (
                                  <Fragment>
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
                                      {author.id === currentUser.id ? (
                                        <Fragment>
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
                                        </Fragment>
                                      ) : null}
                                    </Comment.Actions>
                                  </Fragment>
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
                                        placeholder="Viết phản hồi..."
                                        onChange={this.onTextChange}
                                        value={replyInput}
                                      />
                                      <Button content="Add Reply" primary />
                                    </Form>
                                  )}
                                </Comment.Group>
                              )}
                            </Fragment>
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
export { QUERY_VIDEO_COMMENTS };
