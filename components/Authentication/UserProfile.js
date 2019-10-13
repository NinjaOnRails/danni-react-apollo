import React, { Component } from 'react';
import { Container, Item, Loader } from 'semantic-ui-react';
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
      <Composed id={userId}>
        {({ user: { currentUser }, userQuery: { data } }) => {
          if (!currentUser && !user) return <Loader active inline="centered" />;
          if (data) user = data.user;
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
