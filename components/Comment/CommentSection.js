import React from 'react';
import { Button, Comment, Form } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import VideoComment from './Comment';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
// import commentSeedData from './commentSeedData';

const QUERY_VIDEO_COMMENTS = gql`
  query QUERY_VIDEO_COMMENTS($video: ID!) {
    comments(where: { video: { id: $video } }) {
      id
      text
      createdAt

      video {
        id
      }

      author {
        id
        name
      }

      reply {
        id
        text
        createdAt
        author {
          id
          name
        }
      }
    }
  }
`;

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

  componentDidMount() {
    console.log(this.props);
  }

  onTextChange = e => {
    this.setState({ commentText: e.target.value });
  };

  render() {
    const { commentText } = this.state;
    const { videoId } = this.props;
    return (
      <Query query={QUERY_VIDEO_COMMENTS} variables={{ video: videoId }}>
        {({ error, loading, data: { comments } }) => (
          <Mutation
            mutation={CREATE_COMMENT_MUTATION}
            variables={{ video: videoId, text: commentText }}
            refetchQueries={[
              { query: QUERY_VIDEO_COMMENTS, variables: { video: videoId } },
            ]}
          >
            {(createComment, { error, loading }) => {
              if (error) return <Error error={error} />;
              return (
                <CommentSectionStyles>
                  <Comment.Group size='large'>
                    <Form
                      reply
                      onSubmit={() => {
                        this.setState({ commentText: '' });
                        createComment();
                      }}
                    >
                      <Form.TextArea
                        placeholder='Viết bình luận...'
                        onChange={this.onTextChange}
                        value={commentText}
                      />
                      <Button content='Add Comment' primary />
                    </Form>
                    {comments &&
                      comments.map(comment => (
                        <VideoComment
                          key={comment.id}
                          comment={comment}
                          videoId={videoId}
                        />
                      ))}
                  </Comment.Group>
                </CommentSectionStyles>
              );
            }}
          </Mutation>
        )}
      </Query>
    );
  }
}

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
};
export default CommentSection;
export { QUERY_VIDEO_COMMENTS };
