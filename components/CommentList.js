import React from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import styled from 'styled-components';

import VideoComment from './Comment';

const CommentSectionStyles = styled.div`
  .ui.large.comments {
    margin: 16px 0;
  }
  .ui.comments .reply.form textarea {
    height: auto;
    width: 100%;
  }
  .ui.form textarea {
    border: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  }
`;
const commentData = [
  {
    id: 415134,
    author: 'Matt',
    date: 'Today at 5:42PM',
    text: 'How artistic!',
    avatar: '',
    likes: 20,
    reply: [],
  },
  {
    id: 37489237589,
    author: 'Elliot Fu',
    date: 'Yesterday at 12:30AM',
    text: 'This has been very useful for my research. Thanks as well!',
    avatar: '',
    likes: 20,
    reply: [
      {
        id: 324345,
        author: 'Jenny Hess',
        date: 'Just now',
        text: 'Elliot you are always so right :)',
        avatar: '',
        likes: 20,
      },
      {
        id: 5654654,
        author: 'Matt',
        date: 'Today at 5:42PM',
        text: 'How artistic!',
        avatar: '',
        likes: 20,
        reply: [],
      },
      {
        id: 7984165,
        author: 'Matt',
        date: 'Today at 5:42PM',
        text: 'How artistic!',
        avatar: '',
        likes: 20,
        reply: [],
      },
      {
        id: 4651657,
        author: 'Matt',
        date: 'Today at 5:42PM',
        text: 'How artistic!',
        avatar: '',
        likes: 20,
        reply: [],
      },
      {
        id: 468546357,
        author: 'Matt',
        date: 'Today at 5:42PM',
        text: 'How artistic!',
        avatar: '',
        likes: 20,
        reply: [],
      },
    ],
  },
  {
    id: 4654327,
    author: 'Joe Henderson',
    date: '5 days ago',
    text: 'Dude, this is awesome. Thanks so much',
    avatar: '',
    likes: 20,
    reply: [],
  },
  {
    id: 454657,
    author: 'Joe Henderson',
    date: '5 days ago',
    text:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Animi, blanditiis. Voluptate laboriosam quidem quis perferendis consectetur minima, dolore voluptatem rerum, error magni veritatis quae. Officia incidunt iure soluta ad nostrum.',
    avatar: '',
    likes: 20,
    reply: [],
  },
];

class CommentList extends React.Component {
  renderComments = () => {
    return commentData.map(comment => (
      <VideoComment key={comment.id} comment={comment} />
    ));
  };

  render() {
    return (
      <CommentSectionStyles>
        <Comment.Group size="large">
          <Form reply>
            <Form.TextArea placeholder="Viết bình luận..." />
            <Button content="Add Comment" primary />
          </Form>
          {this.renderComments()}
        </Comment.Group>
      </CommentSectionStyles>
    );
  }
}
export default CommentList;
