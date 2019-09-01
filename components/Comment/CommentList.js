import React from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
import commentSeedData from './commentSeedData';

class CommentList extends React.Component {
  renderComments = () => {
    return commentSeedData.map(comment => (
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
