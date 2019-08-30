import React from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon } from 'semantic-ui-react';

const VideoComment = ({
  comment: { author, date, text, avatar, reply, likes },
}) => (
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
        <Icon color="blue" name="angle up" size="large" link />
        <span>{likes} </span>
        <Icon name="angle down" size="large" link />

        <Comment.Action>Reply</Comment.Action>
      </Comment.Actions>
    </Comment.Content>
    {reply.length ? (
      <Comment.Group>
        {reply.map(({ id, author, date, text, avatar, reply }) => (
          <Comment key={id}>
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
                <Icon name="angle up" size="large" link />
                <span>{likes} </span>
                <Icon color="blue" name="angle down" size="large" link />
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    ) : null}
  </Comment>
);

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default VideoComment;
