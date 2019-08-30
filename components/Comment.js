import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon } from 'semantic-ui-react';

const VideoComment = ({ author, date, text, avatar, reply, likes }) => (
  <Comment>
    <Comment.Avatar src={avatar} />
    <Comment.Content>
      <Comment.Author as="a">{author}</Comment.Author>
      <Comment.Metadata>
        <div>{date}</div>
      </Comment.Metadata>
      <Comment.Text>
        <p>{text}</p>
      </Comment.Text>
      <Comment.Actions>
        <Icon name="angle up large blue  link" />
        <span>{likes} </span>
        <Icon name="angle down large  link" />

        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
    {reply.length ? (
      <Comment.Group>
        {reply.map(({ author, date, text, avatar, reply }) => (
          <Comment>
            <Comment.Avatar src={avatar} />
            <Comment.Content>
              <Comment.Author as="a">{author}</Comment.Author>
              <Comment.Metadata>
                <div>{date}</div>
              </Comment.Metadata>
              <Comment.Text>
                <p>{text}</p>
              </Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
                <Icon name="angle up large  link" />
                <span>{likes} </span>
                <Icon name="angle down large blue  link" />
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    ) : null}
  </Comment>
);

VideoComment.propTypes = {
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  reply: PropTypes.array.isRequired,
  likes: PropTypes.number.isRequired,
};

export default VideoComment;
