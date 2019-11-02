import React, { Component } from 'react';
import { Container, Item, Loader, Icon } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import { DELETE_AUDVID_MUTATION } from '../../graphql/mutation';
import { CURRENT_USER_QUERY, USER_QUERY } from '../../graphql/query';
import RenderVideos from '../Video/RenderVideos';
import VideoListStyles from '../styles/VideoListStyles';
import { user } from '../UI/ContentLanguage';
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
}) => (
  /* eslint-enable */
  <Mutation
    mutation={DELETE_AUDVID_MUTATION}
    refetchQueries={[
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
    ]}
  >
    {(deleteAudVid, deleteAudVidResult) =>
      render({ deleteAudVid, deleteAudVidResult })
    }
  </Mutation>
);

const Composed = adopt({
  user,
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
          const { audio, video, avatar, displayName } = currentUser;
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
                        uploadsTotal={audio.length}
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
                  <RenderVideos
                    dataAudios={{ audios: audio }}
                    dataVideos={{ videos: video }}
                    hideAuthor
                    currentUser={currentUser}
                    deleteAudVid={deleteAudVid}
                  />
                </VideoListStyles>
              )}
            </Container>
          );
        }}
      </Composed>
    );
  }
}

export default Me;
export { deleteAudVidMutation };
