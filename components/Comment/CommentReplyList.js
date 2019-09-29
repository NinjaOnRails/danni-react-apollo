import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react';
import CommentReply from './CommentReply';

const CommentReplyList = ({
  reply,
  currentUser,
  onReplyClick,
  openAuthModal,
}) => (
  <Comment.Group>
    {reply.map(commentReply => (
      <CommentReply
        key={commentReply.id}
        commentReply={commentReply}
        onReplyClick={onReplyClick}
        currentUser={currentUser}
        openAuthModal={openAuthModal}
      />
    ))}
  </Comment.Group>
);

CommentReplyList.propTypes = {
  reply: PropTypes.array.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  openAuthModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

CommentReplyList.defaultProps = {
  currentUser: null,
};

export default CommentReplyList;
