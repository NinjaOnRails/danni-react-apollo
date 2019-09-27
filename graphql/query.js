import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      displayName
      permissions
      contentLanguage
    }
  }
`;

const CLOUDINARY_AUTH = gql`
  query CLOUDINARY_AUTH($source: String!, $language: Language) {
    cloudinaryAuth(source: $source, language: $language) {
      signature
      timestamp
    }
  }
`;

const VIDEO_QUERY = gql`
  query VIDEO_QUERY($id: ID!, $audioId: ID) {
    video(where: { id: $id }) {
      id
      originId
      originPlatform
      originLanguage
      originTitle
      originDescription
      originAuthor
      originThumbnailUrl
      originThumbnailUrlSd
      duration
      addedBy {
        displayName
      }
      language
      # originTags {
      #   text
      # }
      audio(where: { id: $audioId }) {
        id
        source
        author {
          displayName
        }
        language
        title
        description
        defaultVolume
        startAt
        duration
        # tags {
        #   text
        # }
      }
    }
  }
`;

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY($contentLanguage: [Language!]) {
    videos(where: { language_in: $contentLanguage }, orderBy: createdAt_DESC) {
      id
      originThumbnailUrl
      originThumbnailUrlSd
      originTitle
      duration
      originAuthor
      originViewCount
      addedBy {
        displayName
      }
      audio {
        id
        title
        author {
          displayName
        }
      }
    }
  }
`;

const ALL_AUDIOS_QUERY = gql`
  query ALL_AUDIOS_QUERY($contentLanguage: [Language!]) {
    audios(where: { language_in: $contentLanguage }, orderBy: createdAt_DESC) {
      id
      title
      author {
        displayName
      }
      video {
        id
        originAuthor
        originThumbnailUrl
        originThumbnailUrlSd
        duration
      }
    }
  }
`;

const CONTENT_LANGUAGE_QUERY = gql`
  query {
    contentLanguage @client
    previousPage @client
  }
`;

const VIDEO_COMMENTS_QUERY = gql`
  query VIDEO_COMMENTS_QUERY($video: ID!) {
    hideSigninToComment @client
    comments(where: { video: { id: $video } }) {
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
    }
  }
`;

const LOCAL_STATE_QUERY = gql`
  query {
    showSide @client
    showAuthModal @client
  }
`;

export {
  CURRENT_USER_QUERY,
  CLOUDINARY_AUTH,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
  VIDEO_QUERY,
  VIDEO_COMMENTS_QUERY,
  LOCAL_STATE_QUERY,
};
