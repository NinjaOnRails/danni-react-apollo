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

const useDeleteAudVidMutation = () => {
  const [deleteAudVid, data] = useMutation(DELETE_AUDVID_MUTATION);
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

// const openAuthModal = ({ render }) => (
//   <Mutation mutation={OPEN_AUTH_MODAL_MUTATION}>{render}</Mutation>
// );

const useOpenAuthModal = () => {
  const [openAuthModal] = useMutation(OPEN_AUTH_MODAL_MUTATION);
  return { openAuthModal };
};
export {
  useCurrentUser,
  useCloudinaryAuthAvatar,
  useDeleteAudVidMutation,
  useContentLanguageQuery,
};
