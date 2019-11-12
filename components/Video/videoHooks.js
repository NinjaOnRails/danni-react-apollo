import { useQuery, useMutation } from '@apollo/react-hooks';
import Router from 'next/router';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AUDIO,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../../graphql/query';
import {
  CREATE_AUDIO_MUTATION,
  DELETE_AUDVID_MUTATION,
  CREATE_VIDEO_MUTATION,
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

const useDeleteAudVidMutation = (contentLanguage, userId) => {
  return useMutation(DELETE_AUDVID_MUTATION, {
    refetchQueries: [
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id: userId } },
    ],
    onCompleted: () => Router.push('/'),
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
