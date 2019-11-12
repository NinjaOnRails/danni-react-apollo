import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Comment, Loader } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import {
  useDeleteCommentReplyMutation,
  useCreateCommentReplyVoteMutation,
} from './commentHooks';
import CommentContent from './CommentContent';

const CommentReply = ({
  parentId,
  videoId,
  currentUser,
  onReplyClick,
  commentReply,
}) => {
  const [showEditInput, setShowEditInput] = useState(false);

  const { id } = commentReply;

  const {
    deleteCommentReply,
    data: {
      error: deleteCommentReplyError,
      loading: deleteCommentReplyLoading,
    },
  } = useDeleteCommentReplyMutation({ id, parentId, videoId });

  const {
    createCommentReplyVote,
    data: {
      error: createCommentReplyVoteError,
      loading: createCommentReplyVoteLoading,
    },
  } = useCreateCommentReplyVoteMutation({
    id,
    parentId,
    videoId,
    userId: currentUser.id,
  });

  useEffect(() => {
    setShowEditInput(false);
  }, [currentUser]);

  return (
    <Comment>
      <Error error={deleteCommentReplyError} />
      <Error error={createCommentReplyVoteError} />
      {deleteCommentReplyLoading ? (
        <Loader active />
      ) : (
        <CommentContent
          currentUser={currentUser}
          comment={commentReply}
          videoId={videoId}
          commentType="commentReply"
          showEditInput={showEditInput}
          onReplyClick={onReplyClick}
          closeEditInput={() => setShowEditInput(false)}
          openEditInput={() => setShowEditInput(true)}
          createCommentVoteMutation={{
            createCommentVote: createCommentReplyVote,
            createCommentVoteError: createCommentReplyVoteError,
            createCommentVoteLoading: createCommentReplyVoteLoading,
          }}
          deleteCommentMutation={{
            deleteComment: deleteCommentReply,
            deleteCommentError: deleteCommentReplyError,
            deleteCommentLoading: deleteCommentReplyLoading,
          }}
        />
      )}
    </Comment>
  );
};

CommentReply.propTypes = {
  commentReply: PropTypes.object.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  parentId: PropTypes.string.isRequired,
  videoId: PropTypes.string.isRequired,
};

CommentReply.defaultProps = {
  currentUser: null,
};

export default CommentReply;
