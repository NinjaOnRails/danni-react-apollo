import { useQuery, useMutation } from '@apollo/react-hooks';
import { VIDEO_COMMENTS_QUERY } from '../../graphql/query';
import {
  CREATE_COMMENTREPLY_MUTATION,
  DELETE_COMMENTREPLY_MUTATION,
  CREATE_COMMENT_MUTATION,
  DELETE_COMMENT_MUTATION,
  CREATE_COMMENT_VOTE_MUTATION,
  CREATE_COMMENTREPLY_VOTE_MUTATION,
} from '../../graphql/mutation';

const useDeleteCommentMutation = ({ id, videoId }) => {
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

const useCreateCommentVoteMutation = ({ id, videoId, currentUser }) => {
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
      const userId = currentUser.id;
      const existingVote =
        votingComment.vote.length > 0
          ? votingComment.vote.find(vote => vote.user.id === userId)
          : null;
      localData.comments = localData.comments.map(comment => {
        if (comment.id === votingComment.id) {
          /* eslint-disable */

          if (!existingVote) {
            comment.vote = comment.vote.concat([createVote]);
          } else if (existingVote && existingVote.type !== createVote.type) {
            comment.vote = comment.vote.map(commentVote => {
              if (commentVote.user.id === userId) {
                commentVote.type = createVote.type;
              }
              return commentVote;
            });
          } else if (existingVote && existingVote.type === createVote.type) {
            comment.vote = comment.vote.filter(
              commentVote => commentVote.user.id !== userId
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

const useCreateCommentMutation = ({ text, video }) => {
  const [createComment, data] = useMutation(CREATE_COMMENT_MUTATION, {
    variables: { text, video },
    refetchQueries: [
      {
        query: VIDEO_COMMENTS_QUERY,
        variables: { video },
      },
    ],
  });
  return { createComment, data };
};

const useDeleteCommentReplyMutation = ({ id, parentId, videoId }) => {
  const [deleteCommentReply, data] = useMutation(DELETE_COMMENTREPLY_MUTATION, {
    variables: { commentReply: id },
    // refetchQueries: [
    //   {
    //     query: VIDEO_COMMENTS_QUERY,
    //     variables: { video: videoId },
    //   },
    // ],
    update: (proxy, { data: { deleteCommentReply: deletedCommentReply } }) => {
      const localData = proxy.readQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
      });
      const commentReplyId = deletedCommentReply.id;
      localData.comments = localData.comments.map(comment => {
        /* eslint-disable */
        if (comment.id === parentId) {
          comment.reply = comment.reply.filter(
            reply => reply.id !== commentReplyId
          );
        }
        /* eslint-enable */
        return comment;
      });
      proxy.writeQuery({
        query: VIDEO_COMMENTS_QUERY,
        variables: { video: videoId },
        data: localData,
      });
    },
    optimisticResponse: {
      __typename: 'Mutation',
      deleteCommentReply: {
        id,
        __typename: 'CommentReply',
      },
    },
  });
  return { deleteCommentReply, data };
};

const useCreateCommentReplyVoteMutation = ({
  id,
  parentId,
  videoId,
  currentUser,
}) => {
  const [createCommentReplyVote, data] = useMutation(
    CREATE_COMMENTREPLY_VOTE_MUTATION,
    {
      update: (proxy, { data: { createCommentReplyVote: createVote } }) => {
        // Read the data from our cache for this query.
        const localData = proxy.readQuery({
          query: VIDEO_COMMENTS_QUERY,
          variables: { video: videoId },
        });
        const votingComment = localData.comments.find(
          comment => comment.id === parentId
        );
        const votingReply = votingComment.reply.find(reply => reply.id === id);
        const userId = currentUser.id;
        const existingVote =
          votingReply.vote.length > 0
            ? votingReply.vote.find(vote => vote.user.id === userId)
            : null;
        localData.comments = localData.comments.map(comment => {
          /* eslint-disable */

          if (comment.id === votingComment.id) {
            comment.reply.map(reply => {
              if (reply.id === votingReply.id) {
                if (!existingVote) {
                  reply.vote = reply.vote.concat([createVote]);
                } else if (
                  existingVote &&
                  existingVote.type !== createVote.type
                ) {
                  reply.vote = reply.vote.map(commentReplyVote => {
                    if (commentReplyVote.user.id === userId) {
                      commentReplyVote.type = createVote.type;
                    }
                    return commentReplyVote;
                  });
                } else if (
                  existingVote &&
                  existingVote.type === createVote.type
                ) {
                  reply.vote = reply.vote.filter(
                    commentReplyVote => commentReplyVote.user.id !== userId
                  );
                }
              }
              return reply;
            });
          }
          return comment;
        });
        /* eslint-enable */
        proxy.writeQuery({
          query: VIDEO_COMMENTS_QUERY,
          variables: { video: videoId },
          data: localData,
        });
      },
    }
  );

  return { createCommentReplyVote, data };
};

const useCreateCommentReplyMutation = ({ id, text, videoId }) => {
  const [createCommentReply, data] = useMutation(CREATE_COMMENTREPLY_MUTATION, {
    variables: { comment: id, text },
    refetchQueries: [
      { query: VIDEO_COMMENTS_QUERY, variables: { video: videoId } },
    ],
  });
  return {
    createCommentReply,
    data,
  };
};

const useCommentsQuery = videoId => {
  const { data, loading, error } = useQuery(VIDEO_COMMENTS_QUERY, {
    variables: { video: videoId },
  });
  return { data, loading, error };
};
export {
  useDeleteCommentMutation,
  useCreateCommentVoteMutation,
  useCreateCommentMutation,
  useDeleteCommentReplyMutation,
  useCreateCommentReplyVoteMutation,
  useCreateCommentReplyMutation,
  useCommentsQuery,
};
