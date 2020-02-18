import { useState } from 'react';
import { Container, Item, Loader, Icon } from 'semantic-ui-react';
import Head from 'next/head';
import RenderUserVideoList from '../Video/RenderUserVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
// import UserInfoForm from './UserInfoForm';
import UserInfoForm from './NewUserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';
import { useCurrentUserQuery } from './authHooks';

const Me = () => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  const { currentUser } = useCurrentUserQuery();

  if (!currentUser) return <Loader active inline="centered" />;
  const { id, video, audio, avatar, displayName } = currentUser;

  // Only display videos added by user intentionally, ie language is specified
  const videosWithLang = video.filter(el => el.language);

  // To be displayed by RenderUserVideoList component they need to satisty this condition
  videosWithLang.forEach((el, i) => {
    videosWithLang[i].audio = [];
  });

  // Create video objects from user's audio uploads
  const videosWithAudio = [];
  audio.forEach(({ id: audioId, title, customThumbnail }, i) => {
    audio[i].video.audio = [
      {
        id: audioId,
        title,
        customThumbnail,
        author: { id, displayName },
      },
    ];
    videosWithAudio.push({ ...audio[i].video });
  });
  const videos = [...videosWithAudio, ...videosWithLang];

  return (
    <>
      <Head>
        <title key="title">Danni TV - My account</title>
        <meta key="metaTitle" name="title" content="Danni TV - Tài khoản" />
      </Head>
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
        <VideoListStyles>
          <RenderUserVideoList
            dataVideos={{ videos }}
            hideAuthor
            currentUser={currentUser}
          />
        </VideoListStyles>
      </Container>
    </>
  );
};

export default Me;
