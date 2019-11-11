import React from 'react';
import { Comment, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import CommentSectionStyles from '../styles/Commentstyles';
import Error from '../UI/ErrorMessage';
import CommentForm from './CommentForm';
import { useCurrentUser, useOpenAuthModal } from '../Authentication/AuthHooks';
import { useCommentsQuery } from './CommentHooks';
import VideoComment from './Comment';

const CommentSection = ({ videoId }) => {
  const { currentUser } = useCurrentUser();
  const { data, loading, error } = useCommentsQuery(videoId);
  const { openAuthModal } = useOpenAuthModal();

  return (
    <>
      <Error error={error} />
      {loading ? (
        <Loader active inline="centered" />
      ) : (
        <CommentSectionStyles>
          <Comment.Group size="large">
            <CommentForm
              videoId={videoId}
              openAuthModal={openAuthModal}
              currentUser={currentUser}
            />
            {data.comments.length > 0 &&
              data.comments.map(comment => (
                <VideoComment
                  key={comment.id}
                  comment={comment}
                  videoId={videoId}
                  currentUser={currentUser}
                />
              ))}
          </Comment.Group>
        </CommentSectionStyles>
      )}
    </>
  );
};

CommentSection.propTypes = {
  videoId: PropTypes.string.isRequired,
};
export default CommentSection;
