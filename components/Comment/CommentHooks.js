import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AUDIO,
  CLOUDINARY_AUTH_AVATAR,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
  VIDEO_QUERY,
  VIDEO_COMMENTS_QUERY,
  LOCAL_STATE_QUERY,
} from '../../graphql/query';
import {
  CREATE_AUDIO_MUTATION,
  UPDATE_AUDIO_MUTATION,
  UPDATE_AUDIO_DURATION_MUTATION,
  VIDEO_DELETE,
  UPDATE_VIDEO_MUTATION,
  DELETE_AUDVID_MUTATION,
  CREATE_VIDEO_MUTATION,
  SIGNUP_MUTATION,
  SIGNIN_MUTATION,
  SIGN_OUT_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  CREATE_COMMENTREPLY_MUTATION,
  UPDATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  CREATE_COMMENT_MUTATION,
  UPDATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  TOGGLE_CONTENT_LANGUAGE_MUTATION,
  ADD_CONTENT_LANGUAGE_MUTATION,
  UPDATE_CONTENT_LANGUAGE_MUTATION,
  TOGGLE_SIDEDRAWER_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
  CREATE_COMMENT_VOTE_MUTATION,
  CREATE_COMMENTREPLY_VOTE_MUTATION,
  CLOSE_AUTH_MODAL_MUTATION,
  OPEN_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  UPDATE_USER_MUTATION,
  UPDATE_AVATAR_MUTATION,
} from '../../graphql/mutation';

const useDeleteCommentMutation = (id, videoId) => {
  const [deleteComment, data] = useMutation(DELETE_COMMENT_MUTATION, {
    variables: { comment: id },
    // refetchQueries: [
    //   { query: VIDEO_COMMENTS_QUERY, variables: { video: videoId } },
    // ],
    update: (proxy, { data: { deleteComment: deletedComment } }) => {
      const localData = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      localData.comments = localData.comments.filter(
        comment => comment.id !== deletedComment.id
      );
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data: localData,
      });
    },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteComment: {
        id,
        __typename: 'Comment',
      },
    },
  });
  return { deleteComment, data };
};

const useCreateCommentVoteMutation = (id, videoId, currentUser) => {
  const [createCommentVote, data] = useMutation(CREATE_COMMENT_VOTE_MUTATION, {
    update: (proxy, { data: { createCommentVote: createVote } }) => {
      // Read the data from our cache for this query.
      const localData = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      const votingComment = localData.comments.find(
        comment => comment.id === id
      );
      const existingVote =
        votingComment.vote.length > 0
          ? votingComment.vote.find(vote => vote.user.id === currentUser.id)
          : null;
      localData.comments = localData.comments.map(comment => {
        if (comment.id === votingComment.id) {
          /* eslint-disable */

          if (!existingVote) {
            comment.vote = comment.vote.concat([createVote]);
          } else if (existingVote && existingVote.type !== createVote.type) {
            comment.vote = comment.vote.map(commentVote => {
              if (commentVote.user.id === currentUser.id) {
                commentVote.type = createVote.type;
              }
              return commentVote;
            });
          } else if (existingVote && existingVote.type === createVote.type) {
            comment.vote = comment.vote.filter(
              commentVote => commentVote.user.id !== currentUser.id
            );
          }
          /* eslint-enable */
        }
        return comment;
      });
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data: localData,
      });
    },
  });
  return { createCommentVote, data };
};

export { useDeleteCommentMutation, useCreateCommentVoteMutation };
