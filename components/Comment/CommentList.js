import React from 'react';
import PropTypes from 'prop-types';
import VideoComment from './Comment';

class CommentList extends React.Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (this.props.comments === nextProps.comments) {
      return false;
    } else {
      return true;
    }
  }

  render() {
    const { comments, client, videoId, currentUser } = this.props;
    return (
      <>
        {comments.map(comment => (
          <VideoComment
            key={comment.id}
            comment={comment}
            videoId={videoId}
            currentUser={currentUser}
            client={client}
          />
        ))}
      </>
    );
  }
}

CommentList.defaultProps = {
  comments: [],
  currentUser: null,
};

CommentList.propTypes = {
  comments: PropTypes.array,
  client: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

export default CommentList;
