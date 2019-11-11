import React, { useState } from 'react';
import { Container, Item, Loader, Icon } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { DELETE_AUDVID_MUTATION } from '../../graphql/mutation';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../../graphql/query';
import RenderVideoList from '../Video/RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';
import {
  useCurrentUser,
  useDeleteAudVidMutation,
  useContentLanguageQuery,
} from './AuthHooks';

/* eslint-disable */
const deleteAudVidMutation = ({
  render,
  user: {
    currentUser: { id },
  },
  contentLanguageQuery: { contentLanguage },
}) => (
  /* eslint-enable */
  <Mutation
    mutation={DELETE_AUDVID_MUTATION}
    refetchQueries={[
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    ]}
  >
    {(deleteAudVid, deleteAudVidResult) =>
      render({ deleteAudVid, deleteAudVidResult })
    }
  </Mutation>
);

const Me = () => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  const { currentUser } = useCurrentUser();
  const { contentLanguage } = useContentLanguageQuery();
  if (!currentUser) return <Loader active inline="centered" />;
  const { audio, video, avatar, displayName, id } = currentUser;

  const {
    deleteAudVid,
    data: { loading, error },
  } = useDeleteAudVidMutation(id, contentLanguage);
  return (
    <Container>
      <UserProfileStyles>
        <UpdateAvatarModal
          showUpdateAvatarModal={showUpdateAvatarModal}
          closeUpdateAvatarModal={() => setShowUpdateAvatarModal(false)}
          currentUser={currentUser}
        />
        <Item.Group>
          <Item>
            <Icon.Group size="big">
              <Item.Image src={avatar} alt={displayName} size="medium" />
              <Icon
                corner="top left"
                name="write"
                bordered
                link
                onClick={() => setShowUpdateAvatarModal(true)}
              />
            </Icon.Group>
            {editMode ? (
              <UserInfoForm
                currentUser={currentUser}
                onCancelClick={() => setEditMode(false)}
              />
            ) : (
              <UserInfo
                user={currentUser}
                userId={currentUser.id}
                currentUser={currentUser}
                onUserInfoEditClick={() => setEditMode(true)}
                uploadsTotal={audio.length}
                me
              />
            )}
          </Item>
        </Item.Group>
      </UserProfileStyles>
      <h1>Uploads:</h1>
      <Error error={error} />
      {loading ? (
        <Loader active inline="centered" />
      ) : (
        <VideoListStyles>
          <RenderVideoList
            dataAudios={{ audios: audio }}
            dataVideos={{ videos: video }}
            hideAuthor
            currentUser={currentUser}
            deleteAudVid={deleteAudVid}
          />
        </VideoListStyles>
      )}
    </Container>
  );
};

export default Me;
export { deleteAudVidMutation };
