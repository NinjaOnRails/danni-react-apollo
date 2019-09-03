import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon } from 'semantic-ui-react';

const VideoComment = ({ comment: { text, author, reply, createdAt } }) => (
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
        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
    {reply.length ? (
      <Comment.Group>
        {reply.map(
          ({
            id,
            author: replyAuthor,
            text: replyText,
            createdAt: replyDate,
          }) => (
            <Comment key={id}>
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
                  <Comment.Action>Reply</Comment.Action>
                  <Icon name='angle up' size='large' link />
                  <span>{20} </span>
                  <Icon color='blue' name='angle down' size='large' link />
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ),
        )}
      </Comment.Group>
    ) : null}
  </Comment>
);

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default VideoComment;
