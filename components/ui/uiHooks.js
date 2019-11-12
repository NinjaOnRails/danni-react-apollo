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
  TOGGLE_CONTENT_LANGUAGE_MUTATION,
  ADD_CONTENT_LANGUAGE_MUTATION,
  UPDATE_CONTENT_LANGUAGE_MUTATION,
  TOGGLE_SIDEDRAWER_MUTATION,
} from '../../graphql/mutation';

const useOpenAuthModalMutation = () => {
  return useMutation(OPEN_AUTH_MODAL_MUTATION);
};

const useCloseAuthModalMutation = () => {
  return useMutation(CLOSE_AUTH_MODAL_MUTATION);
};

const useCloseSideDrawerMutation = () => {
  return useMutation(CLOSE_SIDEDRAWER_MUTATION);
};

const useToggleSideDrawerMutation = () => {
  return useMutation(TOGGLE_SIDEDRAWER_MUTATION);
};

const useToggleContentLanguageMutation = () => {
  return useMutation(TOGGLE_CONTENT_LANGUAGE_MUTATION);
};

const useAddContentLanguageMutation = () => {
  return useMutation(ADD_CONTENT_LANGUAGE_MUTATION);
};

const useUpdateContentLanguageMutation = () => {
  return useMutation(UPDATE_CONTENT_LANGUAGE_MUTATION);
};

export {
  useOpenAuthModalMutation,
  useCloseAuthModalMutation,
  useCloseSideDrawerMutation,
  useToggleContentLanguageMutation,
  useAddContentLanguageMutation,
  useUpdateContentLanguageMutation,
  useToggleSideDrawerMutation,
};
