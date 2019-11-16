import { useState } from 'react';
import PropTypes from 'prop-types';
import { Item, Loader, Icon } from 'semantic-ui-react';
import Head from 'next/head';
import RenderUserVideoList from '../Video/RenderUserVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';
import { useCurrentUserQuery, useUserQuery } from './authHooks';

const UserProfile = ({
  userId,
  payload: { data: initialData, loading: initialLoading, error },
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  const { currentUser } = useCurrentUserQuery();
  const { data, loading, error: userQueryError } = useUserQuery(userId);

  if (initialLoading || !userId) return <Loader active inline="centered" />;
  if (error) return <Error error={error} />;
  if (loading) return <Loader active inline="centered" />;
  if (userQueryError) return <Error error={userQueryError} />;

  const fetchedUser = data ? data.user : initialData.user;
  const { audio, video, avatar, displayName } = fetchedUser;

  // Only display videos added by user intentionally, ie language is specified
  const videosWithLang = video.filter(el => el.language);

  // To be displayed by RenderUserVideoList component they need to satisty this condition
  videosWithLang.forEach((el, i) => {
    videosWithLang[i].audio = [];
  });

  // Create video objects from user's audio uploads
  const videosWithAudio = [];
  audio.forEach(({ id: audioId, title }, i) => {
    audio[i].video.audio = [
      { id: audioId, title, author: { id: userId, displayName } },
    ];
    videosWithAudio.push({ ...audio[i].video });
  });
  const videos = [...videosWithAudio, ...videosWithLang];

  return (
    <>
      <Head>
        <title key="title">{displayName} | Danni TV</title>
        <meta
          key="metaTitle"
          name="title"
          content={`${displayName} | Danni TV`}
        />
      </Head>
      <UserProfileStyles>
        {currentUser && currentUser.id === userId && (
          <UpdateAvatarModal
            showUpdateAvatarModal={showUpdateAvatarModal}
            closeUpdateAvatarModal={() => setShowUpdateAvatarModal(false)}
            userId={currentUser.id}
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
                uploadsTotal={videos.length}
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
        <VideoListStyles>
          <RenderUserVideoList
            dataAudios={{ audios: audio }}
            dataVideos={{ videos }}
            hideAuthor
            currentUser={currentUser}
          />
        </VideoListStyles>
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
