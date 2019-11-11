import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  CURRENT_USER_QUERY,
  CLOUDINARY_AUTH_AVATAR,
  CONTENT_LANGUAGE_QUERY,
  USER_QUERY,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../../graphql/query';
import {
  DELETE_AUDVID_MUTATION,
  OPEN_AUTH_MODAL_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  SIGNIN_MUTATION,
  CLOSE_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  SIGN_OUT_MUTATION,
  SIGNUP_MUTATION,
} from '../../graphql/mutation';

const useCurrentUser = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  const currentUser = data ? data.currentUser : null;

  return { currentUser, loading };
};

const useCloudinaryAuthAvatar = () => {
  const { loading, error, data } = useQuery(CLOUDINARY_AUTH_AVATAR);
  return {
    loading,
    error,
    data,
  };
};

const useDeleteAudVidMutation = (id, contentLanguage) => {
  const [deleteAudVid, data] = useMutation(DELETE_AUDVID_MUTATION, {
    refetchQueries: [
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    ],
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
};
