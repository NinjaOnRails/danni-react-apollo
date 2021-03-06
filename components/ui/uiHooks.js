import { useMutation } from '@apollo/react-hooks';
import {
  OPEN_AUTH_MODAL_MUTATION,
  CLOSE_AUTH_MODAL_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
  TOGGLE_CONTENT_LANGUAGE_MUTATION,
  ADD_CONTENT_LANGUAGE_MUTATION,
  UPDATE_CONTENT_LANGUAGE_MUTATION,
  OPEN_SIDEDRAWER_MUTATION,
  CLOSE_FULL_DESCRIPTION_MUTATION,
  TOGGLE_FULL_DESCRIPTION_MUTATION,
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

const useOpenSideDrawerMutation = () => {
  return useMutation(OPEN_SIDEDRAWER_MUTATION);
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

const useToggleFullDescriptionMutation = () => {
  return useMutation(TOGGLE_FULL_DESCRIPTION_MUTATION);
};

const useCloseFullDescriptionMutation = () => {
  return useMutation(CLOSE_FULL_DESCRIPTION_MUTATION);
};

export {
  useOpenAuthModalMutation,
  useCloseAuthModalMutation,
  useOpenSideDrawerMutation,
  useCloseSideDrawerMutation,
  useToggleContentLanguageMutation,
  useAddContentLanguageMutation,
  useUpdateContentLanguageMutation,
  useToggleFullDescriptionMutation,
  useCloseFullDescriptionMutation,
};
