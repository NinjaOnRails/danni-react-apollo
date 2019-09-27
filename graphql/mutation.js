import gql from 'graphql-tag';

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION($source: String!, $language: String) {
    createVideo(source: $source, language: $language) {
      id
      originId
      duration
    }
  }
`;

const CREATE_AUDIO_MUTATION = gql`
  mutation CREATE_AUDIO_MUTATION(
    $source: String!
    $language: Language!
    $title: String!
    $description: String
    $tags: String
    $duration: Int!
    $defaultVolume: Int
    $video: ID!
  ) {
    createAudio(
      data: {
        source: $source
        language: $language
        title: $title
        description: $description
        tags: $tags
        duration: $duration
        defaultVolume: $defaultVolume
        video: $video
      }
    ) {
      id
      source
      language
      title
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $name: String
    $displayName: String
    $email: String!
    $password: String!
    $contentLanguage: [Language]
  ) {
    signup(
      data: {
        name: $name
        email: $email
        password: $password
        contentLanguage: $contentLanguage
        displayName: $displayName
      }
    ) {
      id
      name
      email
      displayName
    }
  }
`;

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      displayName
      avatar
    }
  }
`;

const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signout {
      message
    }
  }
`;

const FACEBOOK_LOGIN_MUTATION = gql`
  mutation FACEBOOK_LOGIN_MUTATION(
    $accessToken: String!
    $contentLanguage: [Language]
  ) {
    facebookLogin(
      accessToken: $accessToken
      contentLanguage: $contentLanguage
    ) {
      id
      displayName
      avatar
    }
  }
`;

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION(
    $confirmPassword: String!
    $password: String!
    $resetToken: String!
  ) {
    resetPassword(
      confirmPassword: $confirmPassword
      password: $password
      resetToken: $resetToken
    ) {
      id
      email
      displayName
    }
  }
`;

const CREATE_COMMENTREPLY_MUTATION = gql`
  mutation CREATE_COMMENTREPLY_MUTATION($comment: ID!, $text: String!) {
    createCommentReply(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

const UPDATE_COMMENTREPLY_MUTATION = gql`
  mutation UPDATE_COMMENTREPLY_MUTATION($commentReply: ID!, $text: String) {
    updateCommentReply(commentReply: $commentReply, text: $text) {
      id
      text
    }
  }
`;

const DELETE_COMMENTREPLY_MUTATION = gql`
  mutation DELETE_COMMENTREPLY_MUTATION($commentReply: ID!) {
    deleteCommentReply(commentReply: $commentReply) {
      id
    }
  }
`;

const CREATE_COMMENT_MUTATION = gql`
  mutation CREATE_COMMENT_MUTATION($video: ID!, $text: String!) {
    createComment(video: $video, text: $text) {
      text
    }
  }
`;

const UPDATE_COMMENT_MUTATION = gql`
  mutation UPDATE_COMMENT($comment: ID!, $text: String) {
    updateComment(comment: $comment, text: $text) {
      id
      text
    }
  }
`;

const DELETE_COMMENT_MUTATION = gql`
  mutation DELETE_COMMENT($comment: ID!) {
    deleteComment(comment: $comment) {
      id
    }
  }
`;

const CREATE_COMMENT_VOTE_MUTATION = gql`
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

const CREATE_COMMENTREPLY_VOTE_MUTATION = gql`
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

const TOGGLE_CONTENT_LANGUAGE_MUTATION = gql`
  mutation toggleContentLanguage($language: String!) {
    toggleContentLanguage(language: $language) @client
  }
`;

const ADD_CONTENT_LANGUAGE_MUTATION = gql`
  mutation addContentLanguage($language: String!) {
    addContentLanguage(language: $language) @client
  }
`;

const UPDATE_CONTENT_LANGUAGE_MUTATION = gql`
  mutation updateContentLanguage($contentLanguage: [Language]) {
    updateContentLanguage(contentLanguage: $contentLanguage) {
      id
      contentLanguage
    }
  }
`;

const TOGGLE_SIDEDRAWER_MUTATION = gql`
  mutation {
    toggleSideDrawer @client
  }
`;

const CLOSE_SIDEDRAWER_MUTATION = gql`
  mutation {
    closeSideDrawer @client
  }
`;

export {
  CREATE_AUDIO_MUTATION,
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
  FACEBOOK_LOGIN_MUTATION,
};
