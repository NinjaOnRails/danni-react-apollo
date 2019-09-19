import gql from 'graphql-tag';

export const QUERY_VIDEO_COMMENTS = gql`
  query QUERY_VIDEO_COMMENTS($video: ID!) {
    hideSigninToComment @client
    comments(where: { video: { id: $video } }) {
      id
      text
      createdAt

      audio {
        id
      }

      author {
        id
        displayName
      }

      reply {
        id
        text
        createdAt
        vote {
          id
          type
          user {
            id
          }
        }

        comment {
          id
          video {
            id
          }
        }
        author {
          id
          displayName
        }
      }
      vote {
        id
        user {
          id
        }
        type
      }
    }
  }
`;

export const QUERY_COMMENT = gql`
  query QUERY_COMMENT($id: ID!) {
    comment(where: { id: $id }) {
      id
      text
      createdAt

      audio {
        id
      }
      author {
        id
        displayName
      }
      reply {
        id
        text
        createdAt

        comment {
          id
          video {
            id
          }
        }
        author {
          id
          displayName
        }
      }
      vote {
        id
        user {
          id
        }
        type
      }
    }
  }
`;

export const CREATE_COMMENTREPLY_MUTATION = gql`
  mutation CREATE_COMMENTREPLY_MUTATION($comment: ID!, $text: String!) {
    createCommentReply(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

export const UPDATE_COMMENTREPLY_MUTATION = gql`
  mutation UPDATE_COMMENTREPLY_MUTATION($commentReply: ID!, $text: String) {
    updateCommentReply(commentReply: $commentReply, text: $text) {
      id
      text
    }
  }
`;

export const DELETE_COMMENTREPLY_MUTATION = gql`
  mutation DELETE_COMMENTREPLY_MUTATION($commentReply: ID!) {
    deleteCommentReply(commentReply: $commentReply) {
      id
    }
  }
`;

export const CREATE_COMMENT_MUTATION = gql`
  mutation CREATE_COMMENT_MUTATION($video: ID!, $text: String!) {
    createComment(video: $video, text: $text) {
      text
    }
  }
`;

export const UPDATE_COMMENT_MUTATION = gql`
  mutation UPDATE_COMMENT($comment: ID!, $text: String) {
    updateComment(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

export const DELETE_COMMENT_MUTATION = gql`
  mutation DELETE_COMMENT($comment: ID!) {
    deleteComment(comment: $comment) {
      id
    }
  }
`;

export const CREATE_COMMENT_VOTE_MUTATION = gql`
  mutation CREATE_COMMENTVOTE_MUTATION($comment: ID!, $type: VoteType!) {
    createCommentVote(comment: $comment, type: $type) {
      id
      type
      user {
        id
      }
    }
  }
`;

export const CREATE_COMMENTREPLY_VOTE_MUTATION = gql`
  mutation CREATE_COMMENTREPLY_VOTE_MUTATION(
    $commentReply: ID!
    $type: VoteType!
  ) {
    createCommentReplyVote(commentReply: $commentReply, type: $type) {
      id
      type
      user {
        id
      }
    }
  }
`;
