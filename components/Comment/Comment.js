import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Comment, Icon, Loader } from 'semantic-ui-react';
import Link from 'next/link';
import CommentReplyForm from './CommentReplyForm';
import Error from '../UI/ErrorMessage';
import CommentReplyList from './CommentReplyList';
import StyledPopup from '../styles/PopUpStyles';
import CommentUpdateForm from './CommentUpdateForm';
import {
  useDeleteCommentMutation,
  useCreateCommentVoteMutation,
} from './CommentHooks';
import { formatTime } from './utils';

const VideoComment = ({
  currentUser,
  openAuthModal,
  comment: { id, text, author, reply, createdAt, vote },
  videoId,
}) => {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showEditInput, setShowEditInput] = useState(false);

  const {
    deleteComment,
    data: { error: deleteCommentError, loading: deleteCommentLoading },
  } = useDeleteCommentMutation(id, videoId);

  const {
    createCommentVote,
    data: { loading: createCommentVoteLoading, error: createCommentVoteError },
  } = useCreateCommentVoteMutation(id, videoId, currentUser);

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

  const onConfirmDelete = () => {
    deleteComment();
  };

  const onVoteClick = e => {
    if (currentUser) {
      const type = e.target.id;
      createCommentVote({
        variables: { comment: id, type },
        optimisticResponse: {
          __typename: 'Mutation',
          createCommentVote: {
            id: Math.round(Math.random() * -100000000),
            type,
            user: { id: currentUser.id, __typename: 'User' },
            __typename: 'CommentVote',
          },
        },
      });
    } else {
      openAuthModal();
    }
  };

  let voteType = null;
  let voteCount = 0;
  if (vote.length > 0) {
    voteCount = vote.reduce((total, commentVote) => {
      const i = commentVote.type === 'UPVOTE' ? 1 : -1;
      return total + i;
    }, 0);
    if (currentUser)
      voteType = vote.find(
        commentVote => commentVote.user.id === currentUser.id
      );
  }

  return (
    <Comment>
      <Error error={deleteCommentError} />
      <Error error={createCommentVoteError} />
      {deleteCommentLoading ? (
        <Loader active />
      ) : (
        <>
          <Comment.Avatar
            src={
              author && author.avatar
                ? author.avatar
                : '/static/avatar/small/matt.jpg'
            }
          />
          <Comment.Content>
            <Comment.Author>
              <Link href={{ pathname: '/user', query: { id: author.id } }}>
                <a>{author ? author.displayName : <i>deleted user</i>}</a>
              </Link>
            </Comment.Author>
            <Comment.Metadata>
              <div>{formatTime(createdAt)}</div>
            </Comment.Metadata>
            {showEditInput ? (
              <CommentUpdateForm
                id={id}
                videoId={videoId}
                defaultText={text}
                closeEditInput={() => setShowEditInput(false)}
              />
            ) : (
              <>
                <Comment.Text>
                  <p>{text}</p>
                </Comment.Text>
                <Comment.Actions>
                  <Icon
                    id="UPVOTE"
                    name="angle up"
                    color={
                      voteType && voteType.type === 'UPVOTE' ? 'orange' : 'grey'
                    }
                    size="large"
                    link
                    disabled={
                      createCommentVoteLoading || createCommentVoteError
                    }
                    onClick={onVoteClick}
                  />
                  <span>{voteCount}</span>
                  <Icon
                    id="DOWNVOTE"
                    name="angle down"
                    disabled={
                      createCommentVoteLoading || createCommentVoteError
                    }
                    color={
                      voteType && voteType.type === 'DOWNVOTE'
                        ? 'purple'
                        : 'grey'
                    }
                    size="large"
                    link
                    onClick={onVoteClick}
                  />
                  <Comment.Action onClick={onReplyClick}>
                    Trả lời
                  </Comment.Action>
                  {currentUser && author && author.id === currentUser.id ? (
                    <>
                      <Comment.Action onClick={() => setShowEditInput(true)}>
                        Sửa
                      </Comment.Action>
                      <StyledPopup
                        trigger={<Comment.Action>Xoá</Comment.Action>}
                        on="click"
                        position="bottom left"
                      >
                        <Button
                          fluid
                          color="red"
                          content="Xoá bình luận"
                          onClick={() => onConfirmDelete(deleteComment)}
                        />
                      </StyledPopup>
                    </>
                  ) : null}
                </Comment.Actions>
              </>
            )}
          </Comment.Content>
          {reply.length > 0 && (
            <CommentReplyList
              reply={reply}
              currentUser={currentUser}
              onReplyClick={onReplyClick}
              openAuthModal={openAuthModal}
            />
          )}
          {showReplyInput && currentUser && (
            <CommentReplyForm
              closeReplyInput={() => setShowReplyInput(false)}
              showReplyInput={showReplyInput}
              id={id}
              videoId={videoId}
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
  openAuthModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
};

VideoComment.defaultProps = {
  currentUser: null,
};

export default VideoComment;
