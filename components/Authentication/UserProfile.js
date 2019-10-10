import React, { Component } from 'react';
import { Container, Item, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import RenderVideos from '../Video/RenderVideos';
import VideosListStyles from '../styles/VideosListStyles';
import { user } from '../UI/ContentLanguage';
import UserInfo from './UserInfo';
import UserProfileStyles from '../styles/UserProfileStyles';
import UserInfoForm from './UserInfoForm';

const Composed = adopt({
  user,
});

class UserProfile extends Component {
  state = {
    editMode: false,
  };

  onUserInfoEditClick = () => {
    this.setState({ editMode: true });
  };

  onCancelClick = () => {
    this.setState({ editMode: false });
  };

  render() {
    const { userId } = this.props;
    let { user } = this.props;
    const { editMode } = this.state;
    return (
      <Composed>
        {({ user: { currentUser } }) => {
          if (!currentUser && !user) return <Loader active inline="centered" />;
          user = user || currentUser;
          const { audio, video, avatar, displayName } = user;
          const uploadsTotal = audio.length + video.length;
          return (
            <Container>
              <UserProfileStyles>
                <Item.Group>
                  <Item>
                    <Item.Image
                      src={avatar}
                      alt={displayName}
                      label={
                        currentUser &&
                        currentUser.id === userId && {
                          as: 'a',
                          icon: 'write',
                          size: 'big',
                        }
                      }
                      size="medium"
                    />
                    {editMode ? (
                      <UserInfoForm
                        currentUser={currentUser}
                        onCancelClick={this.onCancelClick}
                      />
                    ) : (
                      <UserInfo
                        user={user}
                        userId={userId || currentUser.id}
                        currentUser={currentUser}
                        onUserInfoEditClick={this.onUserInfoEditClick}
                        uploadsTotal={uploadsTotal}
                      />
                    )}
                  </Item>
                </Item.Group>
              </UserProfileStyles>
              <h1>Uploads:</h1>
              <VideosListStyles>
                <RenderVideos
                  dataAudios={{ audios: audio }}
                  dataVideos={{ videos: video }}
                  hideAuthor
                  currentUser={currentUser}
                />
              </VideosListStyles>
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
