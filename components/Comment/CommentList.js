import PropTypes from 'prop-types';
import VideoComment from './Comment';

const CommentList = ({
  comments,
  client,
  videoId,
  currentUser,
  openAuthModal,
}) => (
  <>
    {comments.map(comment => (
      <VideoComment
        key={comment.id}
        comment={comment}
        videoId={videoId}
        currentUser={currentUser}
        client={client}
        openAuthModal={openAuthModal}
      />
    ))}
  </>
);

CommentList.defaultProps = {
  comments: [],
  currentUser: null,
};

CommentList.propTypes = {
  comments: PropTypes.array,
  client: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  openAuthModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

export default CommentList;
