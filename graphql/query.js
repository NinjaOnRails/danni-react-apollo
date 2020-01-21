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
        language
      }
      audio {
        id
        customThumbnail
        title
        video {
          id
          originTitle
          originAuthor
          originThumbnailUrl
          duration
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
        language
        audio {
          id
        }
      }
      audio {
        id
        title
        customThumbnail
        video {
          id
          originTitle
          originAuthor
          originThumbnailUrl
          duration
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

const CLOUDINARY_CUSTOM_THUMBNAIL = gql`
  query CLOUDINARY_CUSTOM_THUMBNAIL($youtubeId: String!) {
    cloudinaryAuthCusThumbnail(youtubeId: $youtubeId) {
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
        avatar
      }
      language
      originTags {
        text
      }
      vote {
        id
        type
        user {
          id
        }
      }
      audio(where: { id: $audioId }) {
        id
        customThumbnail
        source
        author {
          id
          displayName
          avatar
        }
        comment {
          id
        }
        language
        title
        description
        defaultVolume
        startAt
        duration
        vote {
          id
          type
          user {
            id
          }
        }
        tags {
          text
        }
        comment {
          id
        }
      }
    }
  }
`;

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY($contentLanguage: [Language!], $cursor: String) {
    videosConnection(
      first: 18
      after: $cursor
      where: {
        OR: [
          { language_in: $contentLanguage }
          { audio_some: { language_in: $contentLanguage } }
        ]
      }
      orderBy: createdAt_DESC
    ) {
      edges {
        node {
          id
          originThumbnailUrl
          originThumbnailUrlSd
          originTitle
          duration
          originAuthor
          originViewCount
          language
          addedBy {
            id
            displayName
            avatar
          }
          audio(where: { language_in: $contentLanguage }) {
            id
            customThumbnail
            title
            author {
              id
              displayName
              avatar
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
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
    previousPage @client
    contentLanguage @client
  }
`;

export {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AUDIO,
  CLOUDINARY_AUTH_AVATAR,
  CLOUDINARY_CUSTOM_THUMBNAIL,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
  VIDEO_QUERY,
  VIDEO_COMMENTS_QUERY,
  LOCAL_STATE_QUERY,
};
