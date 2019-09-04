import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Form, Button } from 'semantic-ui-react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { QUERY_VIDEO_COMMENTS } from './CommentSection';

const CREATE_REPLY = gql`
  mutation CREATE_REPLY($comment: ID!, $text: String!) {
    createReply(comment: $comment, text: $text) {
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
    // let input = e.target.value;
    // if (replyAuthorName) {
    //   input = `@${replyAuthorName} ${e.target.value}`;
    // }
    this.setState({ replyInput: e.target.value });
  };

  onReplyClick = () => {
    this.setState({ showReplyInput: true });
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
        video: { id: videoId },
      },
    } = this.props;
    return (
      <Mutation
        mutation={CREATE_REPLY}
        variables={{ comment: id, text: replyInput }}
        refetchQueries={[
          { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
        ]}
      >
        {(createReply, { error, loading }) => (
          <Comment>
            <Comment.Avatar src={''} />
            <Comment.Content>
              <Comment.Author as='a'>{author.name}</Comment.Author>
              <Comment.Metadata>
                <div>{createdAt}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{text}</p>
              </Comment.Text>
              <Comment.Actions>
                <Icon color='blue' name='angle up' size='large' link />
                <span>{100}</span>
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
                }) => (
                  <Comment key={replyID}>
                    <Comment.Avatar src={''} />
                    <Comment.Content>
                      <Comment.Author as='a'>{replyAuthor.name}</Comment.Author>
                      <Comment.Metadata>
                        <div>{replyDate}</div>
                      </Comment.Metadata>
                      <Comment.Text>
                        <p>{replyText}</p>
                      </Comment.Text>
                      <Comment.Actions>
                        <Icon name='angle up' size='large' link />
                        <span>{20} </span>
                        <Icon
                          color='blue'
                          name='angle down'
                          size='large'
                          link
                        />
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
                    createReply();
                  }}
                >
                  <Form.Input
                    placeholder='Viết phản hồi...'
                    onChange={this.onTextChange}
                    value={replyInput}
                    onSubmit={() => {
                      this.setState({ replyInput: '' });
                      createReply();
                    }}
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
};

export default VideoComment;
