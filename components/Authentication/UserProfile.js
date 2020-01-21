import React, { Component } from 'react';
import { Item, Loader, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import { Query, Mutation } from 'react-apollo';
import Head from 'next/head';
import RenderUserVideoList from '../Video/RenderUserVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import { user, contentLanguageQuery } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import {
  USER_QUERY,
  CURRENT_USER_QUERY,
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

class UserProfile extends Component {
  state = {
    editMode: false,
    showUpdateAvatarModal: false,
  };

  onUserInfoEditClick = () => {
    this.setState({ editMode: true });
  };

  onCancelClick = () => {
    this.setState({ editMode: false });
  };

  openUpdateAvatarModal = () => {
    this.setState({ showUpdateAvatarModal: true });
  };

  closeUpdateAvatarModal = () => {
    this.setState({ showUpdateAvatarModal: false });
  };

  render() {
    const {
      userId,
      payload: { data: initialData, loading: initialLoading, error },
    } = this.props;
    const { editMode, showUpdateAvatarModal } = this.state;
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
          const user = data ? data.user : initialData.user;
          const { audio, video, avatar, displayName } = user;

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
                author: { id: userId, displayName },
              },
            ];
            videosWithAudio.push({ ...audio[i].video });
          });
          const videos = [...videosWithAudio, ...videosWithLang];

          return (
            <>
              <Head>
                <title key="title">{user.displayName} | Danni TV</title>
                <meta
                  key="metaTitle"
                  name="title"
                  content={`${user.displayName} | Danni TV`}
                />
              </Head>
              <UserProfileStyles>
                {currentUser && currentUser.id === userId && (
                  <UpdateAvatarModal
                    showUpdateAvatarModal={showUpdateAvatarModal}
                    closeUpdateAvatarModal={this.closeUpdateAvatarModal}
                    currentUser={currentUser}
                  />
                )}
                <Item.Group>
                  <Item>
                    <Icon.Group size="big">
                      <Item.Image
                        src={avatar}
                        alt={displayName}
                        size="medium"
                      />
                      {currentUser && currentUser.id === userId && (
                        <Icon
                          corner="top left"
                          name="write"
                          bordered
                          link
                          onClick={this.openUpdateAvatarModal}
                        />
                      )}
                    </Icon.Group>
                    {editMode && currentUser ? (
                      <UserInfoForm
                        currentUser={currentUser}
                        onCancelClick={this.onCancelClick}
                      />
                    ) : (
                      <UserInfo
                        user={user}
                        userId={userId}
                        currentUser={currentUser}
                        onUserInfoEditClick={this.onUserInfoEditClick}
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
                <Error error={deleteAudVidError} />
                {deleteAudVidLoading ? (
                  <Loader active inline="centered" />
                ) : (
                  <VideoListStyles>
                    <RenderUserVideoList
                      dataVideos={{ videos }}
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
  }
}

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
