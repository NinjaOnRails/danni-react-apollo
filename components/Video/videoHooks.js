import { useQuery, useMutation } from '@apollo/react-hooks';
import Router from 'next/router';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AUDIO,
  ALL_VIDEOS_QUERY,
  VIDEO_QUERY,
} from '../../graphql/query';
import {
  CREATE_AUDIO_MUTATION,
  DELETE_AUDVID_MUTATION,
  CREATE_VIDEO_MUTATION,
  UPDATE_VIDEO_MUTATION,
  UPDATE_AUDIO_MUTATION,
  VIDEO_DELETE,
  CREATE_VIDEO_VOTE,
  CREATE_AUDIO_VOTE,
} from '../../graphql/mutation';

const useVideoQuery = ({ id, audioId }) => {
  return useQuery(VIDEO_QUERY, {
    variables: { id, audioId },
  });
};
const useAllVideosQuery = contentLanguage => {
  return useQuery(ALL_VIDEOS_QUERY, {
    variables: { contentLanguage },
  });
};

const useCloudinaryAuthAudioQuery = (source, language) => {
  return useQuery(CLOUDINARY_AUTH_AUDIO, { variables: { source, language } });
};

const useDeleteAudVidMutation = ({ contentLanguage, userId, redirect }) => {
  return useMutation(DELETE_AUDVID_MUTATION, {
    refetchQueries: [
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id: userId } },
    ],
    onCompleted: () => {
      if (redirect) Router.push('/');
    },
  });
};

const useCreateAudioMutation = (id, contentLanguage) => {
  return useMutation(CREATE_AUDIO_MUTATION, {
    refetchQueries: [
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
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

const useUpdateAudioMutation = id => {
  return useMutation(UPDATE_AUDIO_MUTATION, {
    refetchQueries: [{ query: VIDEO_QUERY, variables: { id } }],
  });
};

const useUpdateVideoMutation = id => {
  return useMutation(UPDATE_VIDEO_MUTATION, {
    refetchQueries: [{ query: VIDEO_QUERY, variables: { id } }],
  });
};

const useDeleteVideoMutation = () => {
  return useMutation(VIDEO_DELETE);
};

const useCreateVideoVoteMutation = ({ currentUser, audioId, id }) => {
  return useMutation(CREATE_VIDEO_VOTE, {
    update: (proxy, { data: { createVideoVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
      });
      const existingVote =
        data.video.vote.length > 0
          ? data.video.vote.find(
              videoVote => videoVote.user.id === currentUser.id
            )
          : null;
      if (!existingVote) {
        data.video.vote = data.video.vote.concat([createVideoVote]);
      } else if (existingVote && existingVote.type !== createVideoVote.type) {
        data.video.vote = data.video.vote.map(videoVote => {
          if (videoVote.user.id === currentUser.id) {
            videoVote.type = createVideoVote.type;
          }
          return videoVote;
        });
      } else if (existingVote && existingVote.type === createVideoVote.type) {
        data.video.vote = data.video.vote.filter(
          videoVote => videoVote.user.id !== currentUser.id
        );
      }
      proxy.writeQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
        data,
      });
    },
  });
};

const useCreateAudioVoteMutation = ({ currentUser, audioId, id }) => {
  return useMutation(CREATE_AUDIO_VOTE, {
    update: (proxy, { data: { createAudioVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
      });

      const existingVote =
        data.video.audio[0].vote.length > 0
          ? data.video.audio[0].vote.find(
              audioVote => audioVote.user.id === currentUser.id
            )
          : null;
      if (!existingVote) {
        data.video.audio[0].vote = data.video.audio[0].vote.concat([
          createAudioVote,
        ]);
      } else if (existingVote && existingVote.type !== createAudioVote.type) {
        data.video.audio[0].vote = data.video.audio[0].vote.map(audioVote => {
          if (audioVote.user.id === currentUser.id) {
            audioVote.type = createAudioVote.type;
          }
          return audioVote;
        });
      } else if (existingVote && existingVote.type === createAudioVote.type) {
        data.video.audio[0].vote = data.video.audio[0].vote.filter(
          audioVote => audioVote.user.id !== currentUser.id
        );
      }
      // data.video.audio[0].vote = vote;
      proxy.writeQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
        data,
      });
    },
  });
};

export {
  useAllVideosQuery,
  useVideoQuery,
  useDeleteAudVidMutation,
  useCreateAudioMutation,
  useUpdateAudioMutation,
  useCreateVideoMutation,
  useUpdateVideoMutation,
  useDeleteVideoMutation,
  useCloudinaryAuthAudioQuery,
  useCreateVideoVoteMutation,
  useCreateAudioVoteMutation,
};
