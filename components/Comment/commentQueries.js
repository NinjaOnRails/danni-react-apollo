import gql from 'graphql-tag';

export const QUERY_VIDEO_COMMENTS = gql`
  query QUERY_VIDEO_COMMENTS($video: ID!) {
    comments(where: { video: { id: $video } }) {
      id
      text
      createdAt
      upvoteCount
      downvoteCount
      audio {
        id
      }
      author {
        id
        name
      }
      reply {
        id
        text
        createdAt
        upvoteCount
        downvoteCount
        comment {
          id
          video {
            id
          }
        }
        author {
          id
          name
        }
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
