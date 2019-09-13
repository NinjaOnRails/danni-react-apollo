import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button, Loader } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import moment from 'moment';
import Error from '../UI/ErrorMessage';
import User from '../Authentication/User';
import {
  UPDATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  QUERY_VIDEO_COMMENTS,
} from './commentQueries';

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
    } = this.props;
    const { showEditForm, editInput, editFormValid } = this.state;
    return (
      <User>
        {({ data }) => {
          const currentUser = data ? data.currentUser : null;
          return (
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
              {(
                deleteCommentReply,
                {
                  error: deleteCommentReplyError,
                  loading: deleteCommentReplyLoading,
                }
              ) => (
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
                  {(
                    updateCommentReply,
                    {
                      error: updateCommentReplyError,
                      loading: updateCommentReplyLoading,
                    }
                  ) => (
                    <Comment>
                      <Error error={deleteCommentReplyError} />
                      <Error error={updateCommentReplyError} />
                      {deleteCommentReplyLoading ? (
                        <Loader active inline="centered" />
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
                                  onClick={() =>
                                    this.setState({ showEditForm: false })
                                  }
                                />
                              </Form>
                            )}
                            {!showEditForm && (
                              <Fragment>
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
                                  author.id === currentUser.id ? (
                                    <>
                                      <Comment.Action
                                        onClick={this.onClickEdit}
                                      >
                                        Edit
                                      </Comment.Action>
                                      <Comment.Action
                                        onClick={deleteCommentReply}
                                      >
                                        Delete
                                      </Comment.Action>
                                    </>
                                  ) : null}
                                </Comment.Actions>
                              </Fragment>
                            )}
                          </Comment.Content>
                        </Fragment>
                      )}
                    </Comment>
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

CommentReply.propTypes = {
  commentReply: PropTypes.object.isRequired,
  onReplyClick: PropTypes.func.isRequired,
};

export default CommentReply;
