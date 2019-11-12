import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  CLOUDINARY_AUTH_AVATAR,
  ALL_VIDEOS_QUERY,
  CONTENT_LANGUAGE_QUERY,
  LOCAL_STATE_QUERY,
} from '../../graphql/query';
import {
  DELETE_AUDVID_MUTATION,
  SIGNUP_MUTATION,
  SIGNIN_MUTATION,
  SIGN_OUT_MUTATION,
  REQUEST_RESET_MUTATION,
  RESET_PASSWORD_MUTATION,
  CLOSE_AUTH_MODAL_MUTATION,
  OPEN_AUTH_MODAL_MUTATION,
  FACEBOOK_LOGIN_MUTATION,
  UPDATE_AVATAR_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
} from '../../graphql/mutation';

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

export { useDeleteAudVidMutation };
