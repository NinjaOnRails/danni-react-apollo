import React, { Component } from 'react';
import { Container, Item, Loader, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import { Query } from 'react-apollo';
import RenderVideos from '../Video/RenderVideos';
import VideoListStyles from '../styles/VideoListStyles';
import { user } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';
import { USER_QUERY } from '../../graphql/query';
import UpdateAvatarModal from './UpdateAvatarModal';

const userQuery = ({ render, id }) => (
  <Query query={USER_QUERY} variables={{ id }}>
    {render}
  </Query>
);

const Composed = adopt({
  userQuery,
  user,
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
    const { userId } = this.props;
    let { user } = this.props;
    const { editMode, showUpdateAvatarModal } = this.state;
    return (
      <Composed id={userId}>
        {({ user: { currentUser }, userQuery: { data } }) => {
          if (!currentUser && !user) return <Loader active inline="centered" />;
          if (data) user = data.user;
          const { audio, video, avatar, displayName } = user;
          const uploadsTotal = audio.length + video.length;
          return (
            <Container>
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
                    {currentUser && currentUser.id === userId && (
                      <Button
                        icon
                        size="big"
                        onClick={this.openUpdateAvatarModal}
                      >
                        <Icon name="write" />
                      </Button>
                    )}
                    <Item.Image src={avatar} alt={displayName} size="medium" />
                    {editMode ? (
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

UserProfile.propTypes = {
  user: PropTypes.object,
  userId: PropTypes.string,
};

UserProfile.defaultProps = {
  user: null,
  userId: null,
};

export default UserProfile;
