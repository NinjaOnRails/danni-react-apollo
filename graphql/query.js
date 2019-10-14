import gql from 'graphql-tag';

const CURRENT_USER_QUERY = gql`
  query {
    currentUser {
      id
      displayName
      permissions
      contentLanguage
      avatar
      name
      email
      location
      bio
      showName
      showEmail
      showBio
      showLocation
      video {
        id
        originTitle
        originAuthor
        originThumbnailUrl
        duration
        addedBy {
          id
        }
        audio {
          id
        }
      }
      audio {
        id
        title
        video {
          id
          originTitle
          originAuthor
          originThumbnailUrl
          duration
        }
        author {
          id
        }
      }
    }
  }
`;

const USER_QUERY = gql`
  query USER_QUERY($id: ID!) {
    user(id: $id) {
      createdAt
      displayName
      contentLanguage
      avatar
      name
      email
      location
      bio
      video {
        id
        originTitle
        originAuthor
        originThumbnailUrl
        duration
        addedBy {
          id
        }
        audio {
          id
        }
      }
      audio {
        id
        title
        video {
          id
          originTitle
          originAuthor
          originThumbnailUrl
          duration
        }
        author {
          id
        }
      }
    }
  }
`;

const CLOUDINARY_AUTH_AUDIO = gql`
  query CLOUDINARY_AUTH_AUDIO($source: String!, $language: Language) {
    cloudinaryAuthAudio(source: $source, language: $language) {
      signature
      timestamp
    }
  }
`;

const CLOUDINARY_AUTH_AVATAR = gql`
  query {
    cloudinaryAuthAvatar {
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
        id
        displayName
      }
      language
      audio(where: { id: $audioId }) {
        id
        source
        author {
          id
          displayName
        }
        language
        title
        description
        defaultVolume
        startAt
        duration
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
        id
        displayName
      }
      audio {
        id
        title
        author {
          id
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
        id
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
        avatar
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
          avatar
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
  USER_QUERY,
  CLOUDINARY_AUTH_AUDIO,
  CLOUDINARY_AUTH_AVATAR,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
  VIDEO_QUERY,
  VIDEO_COMMENTS_QUERY,
  LOCAL_STATE_QUERY,
};
