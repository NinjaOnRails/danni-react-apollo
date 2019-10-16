import React, { Component } from 'react';
import {
  Container,
  Item,
  Loader,
  Button,
  Icon,
  Popup,
} from 'semantic-ui-react';
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
import Error from '../UI/ErrorMessage';

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
    const {
      userId,
      payload: { data: initialData, loading: initialLoading, error },
    } = this.props;
    const { editMode, showUpdateAvatarModal } = this.state;
    if (initialLoading || !userId) return <Loader active inline="centered" />;
    if (error) return <Error error={error} />;

    return (
      <Composed id={userId}>
        {({ user: { currentUser }, userQuery: { data, loading, error } }) => {
          if (loading) return <Loader active inline="centered" />;
          if (error) return <Error error={error} />;
          const user = data ? data.user : initialData.user;
          const { audio, video, avatar, displayName } = user;
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
                    <Icon.Group size="big">
                      <Item.Image
                        src={avatar}
                        alt={displayName}
                        size="medium"
                      />
                      {currentUser && currentUser.id === userId && (
                        <Popup
                          trigger={
                            <Icon
                              corner="top left"
                              name="write"
                              bordered
                              link
                              onClick={this.openUpdateAvatarModal}
                            />
                          }
                          content="Thay đổi avatar"
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
                        uploadsTotal={audio.length}
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
  payload: PropTypes.object,
  userId: PropTypes.string,
};

UserProfile.defaultProps = {
  payload: null,
  userId: null,
};

export default UserProfile;
