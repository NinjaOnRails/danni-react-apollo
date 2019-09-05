import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { QUERY_VIDEO_COMMENTS } from './CommentSection';

const CREATE_COMMENT_REPLY = gql`
  mutation CREATE_COMMENT_REPLY($comment: ID!, $text: String!) {
    createCommentReply(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

class VideoComment extends React.Component {
  state = {
    replyInput: '',
    showReplyInput: false,
  };

  onTextChange = e => {
    this.setState({ replyInput: e.target.value });
  };

  onReplyClick = () => {
    this.setState({ showReplyInput: true });
  };

  formatTime = time => {
    return `${moment(time).fromNow('yy')} ago`;
  };

  render() {
    const { replyInput, showReplyInput } = this.state;
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
      <Mutation
        mutation={CREATE_COMMENT_REPLY}
        variables={{ comment: id, text: replyInput }}
        refetchQueries={[
          { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
        ]}
      >
        {(createCommentReply, { error, loading }) => (
          <Comment>
            <Comment.Avatar src={''} />
            <Comment.Content>
              <Comment.Author as='a'>{author.name}</Comment.Author>
              <Comment.Metadata>
                <div>{this.formatTime(createdAt)}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{text}</p>
              </Comment.Text>
              <Comment.Actions>
                <Icon name='angle up' size='large' link />
                <span>{+upvoteCount - +downvoteCount}</span>
                <Icon name='angle down' size='large' link />
                <Comment.Action onClick={this.onReplyClick}>
                  Reply
                </Comment.Action>
              </Comment.Actions>
            </Comment.Content>
            <Comment.Group>
              {reply.map(
                ({
                  id: replyID,
                  author: replyAuthor,
                  text: replyText,
                  createdAt: replyDate,
                  upvoteCount: replyUpvoteCount,
                  downvoteCount: replyDownvoteCount,
                }) => (
                  <Comment key={replyID}>
                    <Comment.Avatar src={''} />
                    <Comment.Content>
                      <Comment.Author as='a'>{replyAuthor.name}</Comment.Author>
                      <Comment.Metadata>
                        <div>{this.formatTime(replyDate)}</div>
                      </Comment.Metadata>
                      <Comment.Text>
                        <p>{replyText}</p>
                      </Comment.Text>
                      <Comment.Actions>
                        <Icon name='angle up' size='large' link />
                        <span>{+replyUpvoteCount - +replyDownvoteCount} </span>
                        <Icon name='angle down' size='large' link />
                        <Comment.Action onClick={this.onReplyClick}>
                          Reply
                        </Comment.Action>
                      </Comment.Actions>
                    </Comment.Content>
                  </Comment>
                ),
              )}
              {showReplyInput && (
                <Form
                  reply
                  onSubmit={() => {
                    this.setState({ replyInput: '' });
                    createCommentReply();
                  }}
                >
                  <Form.Input
                    placeholder='Viết phản hồi...'
                    onChange={this.onTextChange}
                    value={replyInput}
                  />
                  <Button content='Add Reply' primary />
                </Form>
              )}
            </Comment.Group>
          </Comment>
        )}
      </Mutation>
    );
  }
}

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
};

export default VideoComment;
