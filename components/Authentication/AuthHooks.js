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

const useCurrentUser = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  const currentUser = data ? data.currentUser : null;

  return { currentUser, loading };
};

const useUserQuery = id => {
  const { data, loading, error } = useQuery(USER_QUERY, { variables: { id } });
  return { data, loading, error };
};

const useCloudinaryAuthAvatar = () => {
  const { loading, error, data } = useQuery(CLOUDINARY_AUTH_AVATAR);
  return {
    loading,
    error,
    data,
  };
};

const useDeleteAudVidMutation = (contentLanguage, userId = null) => {
  const refetchQueries = [
    { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    { query: CURRENT_USER_QUERY },
  ];
  if (userId)
    refetchQueries.push({ query: USER_QUERY, variables: { id: userId } });
  const [deleteAudVid, data] = useMutation(DELETE_AUDVID_MUTATION, {
    refetchQueries: [...refetchQueries],
  });
  return {
    deleteAudVid,
    data,
  };
};

const useContentLanguageQuery = () => {
  const { data } = useQuery(CONTENT_LANGUAGE_QUERY);
  const contentLanguage = data ? data.contentLanguage : [];
  return {
    contentLanguage,
  };
};

const useOpenAuthModal = () => {
  const [openAuthModal] = useMutation(OPEN_AUTH_MODAL_MUTATION);
  return { openAuthModal };
};

const useCloseAuthModalMutation = () => {
  const [closeAuthModal] = useMutation(CLOSE_AUTH_MODAL_MUTATION);
  return { closeAuthModal };
};

const useRequestReset = email => {
  const [requestReset, data] = useMutation(REQUEST_RESET_MUTATION, {
    variables: { email },
  });
  return {
    requestReset,
    data,
  };
};

const useResetPasswordMutation = (resetToken, variables) => {
  const [resetPassword, data] = useMutation(RESET_PASSWORD_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    variables: { resetToken, ...variables },
  });
  return { resetPassword, data };
};

const useSigninMutation = () => {
  const [signin, data] = useMutation(SIGNIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
  return { signin, data };
};

const useFacebookLoginMutation = () => {
  const [facebookLogin, data] = useMutation(FACEBOOK_LOGIN_MUTATION);
  return { facebookLogin, data };
};

const useLocalStateQuery = () => {
  const { data } = useQuery(CONTENT_LANGUAGE_QUERY);
  const contentLanguage = data ? data.contentLanguage : [];
  const { previousPage } = data;
  return { contentLanguage, previousPage };
};

const useSignoutMutation = () => {
  const [signout, data] = useMutation(SIGN_OUT_MUTATION);
  return { signout, data };
};

const useSignupMutation = (contentLanguage, variables) => {
  const [signup, data] = useMutation(SIGNUP_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    variables: { ...variables, contentLanguage: contentLanguage || [] },
  });
  return { signup, data };
};

const useUpdateAvatarMutation = id => {
  const [updateAvatar, data] = useMutation(UPDATE_AVATAR_MUTATION, {
    // variables: {avatar}
    refetchQueries: [
      { query: USER_QUERY, variables: { id } },
      { query: CURRENT_USER_QUERY },
    ],
  });

  return { updateAvatar, data };
};

export {
  useCurrentUser,
  useCloudinaryAuthAvatar,
  useDeleteAudVidMutation,
  useContentLanguageQuery,
  useRequestReset,
  useOpenAuthModal,
  useResetPasswordMutation,
  useSigninMutation,
  useCloseAuthModalMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
  useSignoutMutation,
  useSignupMutation,
  useUpdateAvatarMutation,
  useUserQuery,
};
