import React, { Component } from 'react';
import { Container, Item, Loader, Button, Icon } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import RenderVideos from '../Video/RenderVideos';
import VideoListStyles from '../styles/VideoListStyles';
import { user } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import UpdateAvatarModal from './UpdateAvatarModal';

const Composed = adopt({
  user,
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
        {({ user: { currentUser } }) => {
          if (!currentUser) return <Loader active inline="centered" />;
          const { audio, video, avatar, displayName } = currentUser;
          const uploadsTotal = audio.length + video.length;
          return (
            <Container>
              <UserProfileStyles>
                <UpdateAvatarModal
                  showUpdateAvatarModal={showUpdateAvatarModal}
                  closeUpdateAvatarModal={this.closeUpdateAvatarModal}
                  currentUser={currentUser}
                />
                <Item.Group>
                  <Item>
                    <Button
                      icon
                      size="big"
                      onClick={this.openUpdateAvatarModal}
                    >
                      <Icon name="write" />
                    </Button>
                    <Item.Image src={avatar} alt={displayName} size="medium" />
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
                        uploadsTotal={uploadsTotal}
                      />
                    )}
                  </Item>
                </Item.Group>
              </UserProfileStyles>
              <h1>Uploads:</h1>
              <VideoListStyles>
                <RenderVideos
                  dataAudios={{ audios: audio }}
                  dataVideos={{ videos: video }}
                  hideAuthor
                  currentUser={currentUser}
                />
              </VideoListStyles>
            </Container>
          );
        }}
      </Composed>
    );
  }
}

export default Me;
