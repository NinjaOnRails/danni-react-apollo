import PropTypes from 'prop-types';
import Link from 'next/link';
import { Comment, Icon, Loader, Button } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import StyledPopup from '../styles/PopUpStyles';
import CommentUpdateForm from './CommentEditForm';
import { formatTime } from './utils';
import { useOpenAuthModalMutation } from '../UI/uiHooks';

const CommentContent = ({
  currentUser,
  videoId,
  commentType,
  showEditInput,
  onReplyClick,
  closeEditInput,
  openEditInput,
  comment: { id, vote, author, createdAt, text },
  createCommentVoteMutation: {
    createCommentVote,
    createCommentVoteError,
    createCommentVoteLoading,
  },
  deleteCommentMutation: {
    deleteComment,
    deleteCommentError,
    deleteCommentLoading,
  },
}) => {
  const [openAuthModal] = useOpenAuthModalMutation();

  const onVoteClick = ({ target: { id: type } }) => {
    if (currentUser) {
      const config = {};
      if (commentType === 'comment') {
        config.typeName = 'CommentVote';
        config.dummy = 'createCommentVote';
      } else {
        config.typeName = 'CommentReplyVote';
        config.dummy = 'createCommentReplyVote';
      }
      createCommentVote({
        variables: { [commentType]: id, type },
        optimisticResponse: {
          __typename: 'Mutation',
          [config.dummy]: {
            id: Math.round(Math.random() * -100000000),
            type,
            user: {
              id: currentUser.id,
              __typename: 'User',
            },
            __typename: config.typeName,
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

  const voteDisabled = createCommentVoteError || createCommentVoteLoading;

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
                : 'https://react.semantic-ui.com/images/avatar/small/matt.jpg'
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
                closeEditInput={closeEditInput}
                commentType={commentType}
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
                    size="large"
                    link
                    disabled={voteDisabled}
                    color={
                      voteType && voteType.type === 'UPVOTE' ? 'orange' : 'grey'
                    }
                    onClick={e => onVoteClick(e, createCommentVote)}
                  />
                  <span>{voteCount} </span>
                  <Icon
                    id="DOWNVOTE"
                    name="angle down"
                    size="large"
                    link
                    disabled={voteDisabled}
                    color={
                      voteType && voteType.type === 'DOWNVOTE'
                        ? 'purple'
                        : 'grey'
                    }
                    onClick={e => onVoteClick(e, createCommentVote)}
                  />
                  <Comment.Action onClick={onReplyClick}>
                    Reply
                  </Comment.Action>
                  {currentUser && author && author.id === currentUser.id ? (
                    <>
                      <Comment.Action onClick={openEditInput}>
                        Edit
                      </Comment.Action>
                      <StyledPopup
                        trigger={<Comment.Action>Delete</Comment.Action>}
                        on="click"
                        position="bottom right"
                      >
                        <Button
                          fluid
                          color="red"
                          content="Delete comment"
                          onClick={deleteComment}
                        />
                      </StyledPopup>
                    </>
                  ) : null}
                </Comment.Actions>
              </>
            )}
          </Comment.Content>
        </>
      )}
    </Comment>
  );
};

CommentContent.propTypes = {
  currentUser: PropTypes.object,
  videoId: PropTypes.string.isRequired,
  commentType: PropTypes.string.isRequired,
  showEditInput: PropTypes.bool.isRequired,
  onReplyClick: PropTypes.func.isRequired,
  closeEditInput: PropTypes.func.isRequired,
  openEditInput: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  createCommentVoteMutation: PropTypes.object.isRequired,
  deleteCommentMutation: PropTypes.object.isRequired,
};

CommentContent.defaultProps = {
  currentUser: null,
};

export default CommentContent;
