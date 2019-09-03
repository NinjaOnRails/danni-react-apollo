import React from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
// import commentSeedData from './commentSeedData';

const CREATE_COMMENT_MUTATION = gql`
  mutation CREATE_COMMENT_MUTATION($video: ID!, $text: String!) {
    createComment(video: $video, text: $text) {
      text
    }
  }
`;

class CommentSection extends React.Component {
  state = {
    commentText: '',
  };

  onTextChange = e => {
    this.setState({ commentText: e.target.value });
  };

  renderComments = () => {
    const { commentList } = this.props;
    return commentList.map(({ id, ...otherProps }) => (
      <VideoComment key={id} {...otherProps} />
    ));
  };

  render() {
    const { videoId } = this.props;
    const { commentText } = this.state;
    return (
      <Mutation
        mutation={CREATE_COMMENT_MUTATION}
        variables={{ id: videoId, text: commentText }}
      >
        {(createComment, { error, loading }) => (
          <CommentSectionStyles>
            <Comment.Group size='large'>
              <Form reply onSubmit={createComment}>
                <Form.TextArea
                  placeholder='Viết bình luận...'
                  onChange={this.onTextChange}
                />
                <Button content='Add Comment' primary />
              </Form>
              {/* {this.renderComments()} */}
            </Comment.Group>
          </CommentSectionStyles>
        )}
      </Mutation>
    );
  }
}

CommentSection.defaultProps = {
  commentList: [],
};

CommentSection.propTypes = {
  commentList: PropTypes.array,
  videoId: PropTypes.string.isRequired,
};
export default CommentSection;
