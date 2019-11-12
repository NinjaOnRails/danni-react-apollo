import React, { useState } from 'react';
import { Item, Loader, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import RenderVideoList from '../Video/RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';
import {
  useCurrentUserQuery,
  useUserQuery,
  useLocalStateQuery,
} from './authHooks';
import { useDeleteAudVidMutation } from '../Video/videoHooks';

// refactor

const UserProfile = ({
  userId,
  payload: { data: initialData, loading: initialLoading, error },
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  const { currentUser } = useCurrentUserQuery();
  const { data, loading, error: userQueryError } = useUserQuery(userId);
  const { contentLanguage } = useLocalStateQuery();

  const [
    deleteAudVid,
    { loading: deleteAudVidLoading, error: deleteAudVidError },
  ] = useDeleteAudVidMutation(contentLanguage, userId);

  if (initialLoading || !userId) return <Loader active inline="centered" />;
  if (error) return <Error error={error} />;
  if (loading) return <Loader active inline="centered" />;
  if (userQueryError) return <Error error={userQueryError} />;

  const fetchedUser = data ? data.user : initialData.user;
  const { audio, video, avatar, displayName } = fetchedUser;

  return (
    <>
      <UserProfileStyles>
        {currentUser && currentUser.id === userId && (
          <UpdateAvatarModal
            showUpdateAvatarModal={showUpdateAvatarModal}
            closeUpdateAvatarModal={() => setShowUpdateAvatarModal(false)}
            currentUser={currentUser}
          />
        )}
        <Item.Group>
          <Item>
            <Icon.Group size="big">
              <Item.Image src={avatar} alt={displayName} size="medium" />
              {currentUser && currentUser.id === userId && (
                <Icon
                  corner="top left"
                  name="write"
                  bordered
                  link
                  onClick={() => setShowUpdateAvatarModal(true)}
                />
              )}
            </Icon.Group>
            {editMode && currentUser ? (
              <UserInfoForm
                currentUser={currentUser}
                onCancelClick={() => setEditMode(false)}
              />
            ) : (
              <UserInfo
                user={fetchedUser}
                userId={userId}
                currentUser={currentUser}
                onUserInfoEditClick={() => setEditMode(true)}
                uploadsTotal={audio.length}
              />
            )}
          </Item>
        </Item.Group>
      </UserProfileStyles>
      <div
        className="upload-container"
        style={{ width: '80%', margin: '3.75rem auto 0 auto' }}
      >
        <h1 style={{ marginBottom: '3rem' }}>Uploads:</h1>
        <Error error={deleteAudVidError} />
        {deleteAudVidLoading ? (
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
      </div>
    </>
  );
};

UserProfile.propTypes = {
  payload: PropTypes.object,
  userId: PropTypes.string,
};

UserProfile.defaultProps = {
  payload: null,
  userId: null,
};

export default UserProfile;
