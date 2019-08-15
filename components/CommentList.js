import React from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';

const CommentList = () => (
  <Comment.Group threaded size="large">
    <Form reply>
      <Form.TextArea />
      <Button content="Add Comment" primary />
    </Form>

    <Comment>
      <Comment.Content>
        <Comment.Author as="a">Matt</Comment.Author>
        <Comment.Metadata>
          <span>Today at 5:42PM</span>
        </Comment.Metadata>
        <Comment.Text>How artistic!</Comment.Text>
        <Comment.Actions>
          <a>Reply</a>
        </Comment.Actions>
      </Comment.Content>
    </Comment>

    <Comment>
      <Comment.Content>
        <Comment.Author as="a">Elliot Fu</Comment.Author>
        <Comment.Metadata>
          <span>Yesterday at 12:30AM</span>
        </Comment.Metadata>
        <Comment.Text>
          <p>This has been very useful for my research. Thanks as well!</p>
        </Comment.Text>
        <Comment.Actions>
          <a>Reply</a>
        </Comment.Actions>
      </Comment.Content>

      <Comment.Group size="large">
        <Comment>
          <Comment.Content>
            <Comment.Author as="a">Jenny Hess</Comment.Author>
            <Comment.Metadata>
              <span>Just now</span>
            </Comment.Metadata>
            <Comment.Text>Elliot you are always so right :)</Comment.Text>
            <Comment.Actions>
              <a>Reply</a>
            </Comment.Actions>
          </Comment.Content>
        </Comment>
      </Comment.Group>
    </Comment>

    <Comment>
      <Comment.Content>
        <Comment.Author as="a">Joe Henderson</Comment.Author>
        <Comment.Metadata>
          <span>5 days ago</span>
        </Comment.Metadata>
        <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
        <Comment.Actions>
          <a>Reply</a>
        </Comment.Actions>
      </Comment.Content>
    </Comment>
  </Comment.Group>
);

export default CommentList;
