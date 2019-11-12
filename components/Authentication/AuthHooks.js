import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AVATAR,
  CONTENT_LANGUAGE_QUERY,
  LOCAL_STATE_QUERY,
} from '../../graphql/query';
import {
  SIGNUP_MUTATION,
  SIGNIN_MUTATION,
  SIGN_OUT_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  UPDATE_AVATAR_MUTATION,
} from '../../graphql/mutation';

const useCurrentUserQuery = () => {
  const { data, loading } = useQuery(CURRENT_USER_QUERY);
  const currentUser = data ? data.currentUser : null;
  return { currentUser, loading };
};

const useUserQuery = id => {
  return useQuery(USER_QUERY, { variables: { id } });
};

const useLocalStateQuery = () => {
  const { data } = useQuery(CONTENT_LANGUAGE_QUERY);
  const contentLanguage = data ? data.contentLanguage : [];
  const { previousPage } = data;
  return { contentLanguage, previousPage };
};

const useLocalDataQuery = () => {
  return useQuery(LOCAL_STATE_QUERY);
};

const useSigninMutation = () => {
  return useMutation(SIGNIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
};

const useFacebookLoginMutation = () => {
  return useMutation(FACEBOOK_LOGIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
  });
};

const useSignupMutation = (contentLanguage, variables) => {
  return useMutation(SIGNUP_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    variables: { ...variables, contentLanguage: contentLanguage || [] },
  });
};

const useRequestResetMutation = email => {
  return useMutation(REQUEST_RESET_MUTATION, {
    variables: { email },
  });
};

const useResetPasswordMutation = (resetToken, variables) => {
  return useMutation(RESET_PASSWORD_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    variables: { resetToken, ...variables },
  });
};

const useSignoutMutation = () => {
  return useMutation(SIGN_OUT_MUTATION);
};

const useUpdateAvatarMutation = id => {
  return useMutation(UPDATE_AVATAR_MUTATION, {
    refetchQueries: [
      { query: USER_QUERY, variables: { id } },
      { query: CURRENT_USER_QUERY },
    ],
  });
};

const useCloudinaryAuthAvatarMutation = () => {
  return useQuery(CLOUDINARY_AUTH_AVATAR);
};

export {
  useCurrentUserQuery,
  useCloudinaryAuthAvatarMutation,
  useRequestResetMutation,
  useResetPasswordMutation,
  useSigninMutation,
  useFacebookLoginMutation,
  useLocalStateQuery,
  useSignoutMutation,
  useSignupMutation,
  useUpdateAvatarMutation,
  useUserQuery,
  useLocalDataQuery,
};
