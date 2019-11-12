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

const useQueryAllAudios = contentLanguage => {
  return useQuery(ALL_AUDIOS_QUERY, {
    variables: { contentLanguage },
  });
};

const useQueryAllVideos = contentLanguage => {
  return useQuery(ALL_VIDEOS_QUERY, {
    variables: { contentLanguage },
  });
};

const useDeleteAudVidMutation = (contentLanguage, userId = null) => {
  const refetchQueries = [
    { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    { query: CURRENT_USER_QUERY },
  ];
  if (userId)
    refetchQueries.push({ query: USER_QUERY, variables: { id: userId } });
  return useMutation(DELETE_AUDVID_MUTATION, {
    refetchQueries: [...refetchQueries],
  });
};

const useCreateAudioMutation = (id, contentLanguage) => {
  return useMutation(CREATE_AUDIO_MUTATION, {
    refetchQueries: [
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
    ],
  });
};

const useCreateVideoMutation = (
  source,
  isAudioSource,
  language,
  id,
  contentLanguage
) => {
  return useMutation(CREATE_VIDEO_MUTATION, {
    variables: {
      source,
      language: isAudioSource ? null : language,
    },
    refetchQueries: [
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
    ],
  });
};

const useCloudinaryAuthAudioQuery = (source, language) => {
  return useQuery(CLOUDINARY_AUTH_AUDIO, { variables: { source, language } });
};

export {
  useQueryAllAudios,
  useQueryAllVideos,
  useDeleteAudVidMutation,
  useCreateAudioMutation,
  useCreateVideoMutation,
  useCloudinaryAuthAudioQuery,
};
