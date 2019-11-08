import React, { useState } from 'react';
import { Item, Loader, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import { Query, Mutation } from 'react-apollo';
import RenderVideoList from '../Video/RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import { user, contentLanguageQuery } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import {
  USER_QUERY,
  CURRENT_USER_QUERY,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../../graphql/query';
import { DELETE_AUDVID_MUTATION } from '../../graphql/mutation';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';

/* eslint-disable */
const userQuery = ({ render, id }) => (
  <Query query={USER_QUERY} variables={{ id }}>
    {render}
  </Query>
);
const deleteAudVidMutation = ({
  render,
  id,
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

const Composed = adopt({
  userQuery,
  user,
  contentLanguageQuery,
  deleteAudVidMutation,
});

const UserProfile = ({
  userId,
  payload: { data: initialData, loading: initialLoading, error },
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showUpdateAvatarModal, setShowUpdateAvatarModal] = useState(false);

  if (initialLoading || !userId) return <Loader active inline="centered" />;
  if (error) return <Error error={error} />;

  return (
    <Composed id={userId}>
      {({
        user: { currentUser },
        userQuery: { data, loading, error },
        deleteAudVidMutation: {
          deleteAudVid,
          deleteAudVidResult: {
            loading: deleteAudVidLoading,
            error: deleteAudVidError,
          },
        },
      }) => {
        if (loading) return <Loader active inline="centered" />;
        if (error) return <Error error={error} />;
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
      }}
    </Composed>
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
export { userQuery };
