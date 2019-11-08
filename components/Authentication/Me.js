import React, { Component } from 'react';
import { Container, Item, Loader, Icon } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import Head from 'next/head';
import { DELETE_AUDVID_MUTATION } from '../../graphql/mutation';
import {
  CURRENT_USER_QUERY,
  USER_QUERY,
  ALL_VIDEOS_QUERY,
} from '../../graphql/query';
import RenderVideoList from '../Video/RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import { user, contentLanguageQuery } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';
import Error from '../UI/ErrorMessage';

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
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    ]}
  >
    {(deleteAudVid, deleteAudVidResult) =>
      render({ deleteAudVid, deleteAudVidResult })
    }
  </Mutation>
);

const Composed = adopt({
  user,
  contentLanguageQuery,
  deleteAudVidMutation,
});

class Me extends Component {
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
    const { editMode, showUpdateAvatarModal } = this.state;
    return (
      <Composed>
        {({
          user: { currentUser },
          deleteAudVidMutation: {
            deleteAudVid,
            deleteAudVidResult: { loading, error },
          },
        }) => {
          if (!currentUser) return <Loader active inline="centered" />;
          const { id, video, audio, avatar, displayName } = currentUser;

          // Only display videos added by user intentionally, ie language is specified
          const videosWithLang = video.filter(el => el.language);

          // To be displayed by RenderVideoList component they need to satisty this condition
          videosWithLang.forEach((el, i) => {
            videosWithLang[i].audio = [];
          });

          // Create video objects from user's audio uploads
          const videosWithAudio = [];
          audio.forEach(({ id: audioId, title }, i) => {
            audio[i].video.audio = [
              { id: audioId, title, author: { id, displayName } },
            ];
            videosWithAudio.push({ ...audio[i].video });
          });
          const videos = [...videosWithAudio, ...videosWithLang];

          return (
            <>
              <Head>
                <title key="title">Danni TV - Tài khoản</title>
                <meta
                  key="metaTitle"
                  name="title"
                  content="Danni TV - Tài khoản"
                />
              </Head>
              <Container>
                <UserProfileStyles>
                  <UpdateAvatarModal
                    showUpdateAvatarModal={showUpdateAvatarModal}
                    closeUpdateAvatarModal={this.closeUpdateAvatarModal}
                    currentUser={currentUser}
                  />
                  <Item.Group>
                    <Item>
                      <Icon.Group size="big">
                        <Item.Image
                          src={avatar}
                          alt={displayName}
                          size="medium"
                        />
                        <Icon
                          corner="top left"
                          name="write"
                          bordered
                          link
                          onClick={this.openUpdateAvatarModal}
                        />
                      </Icon.Group>
                      {editMode ? (
                        <UserInfoForm
                          currentUser={currentUser}
                          onCancelClick={this.onCancelClick}
                        />
                      ) : (
                        <UserInfo
                          user={currentUser}
                          userId={currentUser.id}
                          currentUser={currentUser}
                          onUserInfoEditClick={this.onUserInfoEditClick}
                          uploadsTotal={videos.length}
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
                      dataVideos={{ videos }}
                      hideAuthor
                      currentUser={currentUser}
                      deleteAudVid={deleteAudVid}
                    />
                  </VideoListStyles>
                )}
              </Container>
            </>
          );
        }}
      </Composed>
    );
  }
}

export default Me;
export { deleteAudVidMutation };
