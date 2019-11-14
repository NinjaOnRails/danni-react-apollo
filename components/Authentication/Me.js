import React, { useState } from 'react';
import { Container, Item, Loader, Icon } from 'semantic-ui-react';
import RenderVideoList from '../Video/RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
// import UserInfoForm from './UserInfoForm';
import UserInfoForm from './UserInfoFormRefactored';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';
import { useCurrentUserQuery } from './authHooks';

const Me = () => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  const { currentUser } = useCurrentUserQuery();
  if (!currentUser) return <Loader active inline="centered" />;
  const { audio, video, avatar, displayName, id } = currentUser;

  return (
    <Container>
      <UserProfileStyles>
        <UpdateAvatarModal
          showUpdateAvatarModal={showUpdateAvatarModal}
          closeUpdateAvatarModal={() => setShowUpdateAvatarModal(false)}
          userId={id}
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
      {/* <Error error={error} />
      {loading ? (
        <Loader active inline="centered" />
      ) : ( */}
      <VideoListStyles>
        <RenderVideoList
          dataAudios={{ audios: audio }}
          dataVideos={{ videos: video }}
          hideAuthor
          currentUser={currentUser}
        />
      </VideoListStyles>
      {/* )} */}
    </Container>
  );
};

export default Me;
