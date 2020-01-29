import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Comment, Loader } from 'semantic-ui-react';
import CommentReplyForm from './CommentReplyForm';
import Error from '../UI/ErrorMessage';
import CommentContent from './CommentContent';
import CommentReply from './CommentReply';
import {
  useDeleteCommentMutation,
  useCreateCommentVoteMutation,
} from './commentHooks';
import { useOpenAuthModalMutation } from '../UI/uiHooks';

const VideoComment = ({ currentUser, comment, videoId }) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);

  const { id, reply } = comment;

  const [openAuthModal] = useOpenAuthModalMutation();

  const [
    deleteComment,
    { error: deleteCommentError, loading: deleteCommentLoading },
  ] = useDeleteCommentMutation({ id, videoId });

  const [
    createCommentVote,
    { loading: createCommentVoteLoading, error: createCommentVoteError },
  ] = useCreateCommentVoteMutation({ id, videoId, currentUser });

  useEffect(() => {
    setShowEditInput(false);
    setShowReplyInput(false);
  }, [currentUser]);

  const onReplyClick = () => {
    if (currentUser) {
      setShowReplyInput(true);
    } else {
      openAuthModal();
    }
  };

  return (
    <Comment>
      <Error error={deleteCommentError} />
      <Error error={createCommentVoteError} />
      {deleteCommentLoading ? (
        <Loader active />
      ) : (
        <>
          <CommentContent
            currentUser={currentUser}
            comment={comment}
            videoId={videoId}
            commentType="comment"
            showEditInput={showEditInput}
            onReplyClick={onReplyClick}
            closeEditInput={() => setShowEditInput(false)}
            openEditInput={() => setShowEditInput(true)}
            createCommentVoteMutation={{
              createCommentVote,
              createCommentVoteError,
              createCommentVoteLoading,
            }}
            deleteCommentMutation={{
              deleteComment,
              deleteCommentError,
              deleteCommentLoading,
            }}
          />
          {reply.length > 0 && (
            <Comment.Group>
              {reply.map(commentReply => (
                <CommentReply
                  key={commentReply.id}
                  parentId={id}
                  commentReply={commentReply}
                  videoId={videoId}
                  currentUser={currentUser}
                  onReplyClick={onReplyClick}
                />
              ))}
            </Comment.Group>
          )}
          {showReplyInput && currentUser && (
            <CommentReplyForm
              id={id}
              videoId={videoId}
              closeReplyInput={() => setShowReplyInput(false)}
              showReplyInput={showReplyInput}
            />
          )}
        </>
      )}
    </Comment>
  );
};

VideoComment.propTypes = {
  comment: PropTypes.object.isRequired,
  videoId: PropTypes.string.isRequired,
  currentUser: PropTypes.object,
};

VideoComment.defaultProps = {
  currentUser: null,
};

export default VideoComment;