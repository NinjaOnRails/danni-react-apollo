import React, { Component } from 'react';
import {
  Modal,
  Button,
  Icon,
  List,
  Image,
  Segment,
  Header,
  Radio,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import avatars from '../../lib/avatars';
import CloudinaryUploadAvatar from './CloudinaryUploadAvatar';
import UpdateAvatarModalStyles from '../styles/UpdateAvatarModalStyles';
import { USER_QUERY, CURRENT_USER_QUERY } from '../../graphql/query';
import { UPDATE_AVATAR_MUTATION } from '../../graphql/mutation';
import Error from '../UI/ErrorMessage';
import deleteFile from '../../lib/cloudinaryDeleteFile';

class UpdateAvatarModal extends Component {
  state = {
    activeItem: '',
    choiceType: null,
    secureUrl: '',
    deleteToken: '',
  };

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  renderAvatarList = () => (
    <List horizontal selection>
      {avatars.map(avatar => (
        <List.Item
          key={avatar}
          className={this.state.activeItem === avatar ? 'selected' : ''}
          onClick={() =>
            this.setState({ activeItem: avatar, choiceType: 'list' })
          }
        >
          <Image src={`../../static/avatar/large/${avatar}`} size="tiny" />
        </List.Item>
      ))}
    </List>
  );

  chooseUpload = () => {
    this.setState({ choiceType: 'upload' });
  };

  onSubmit = async updateAvatar => {
    const { choiceType, activeItem, secureUrl, deleteToken } = this.state;
    const { closeUpdateAvatarModal } = this.props;
    const avatar =
      choiceType === 'list'
        ? `/static/avatar/large/${activeItem}`
        : choiceType === 'upload'
        ? secureUrl
        : '';

    const { data } = await updateAvatar({ variables: { avatar } });
    if (data) {
      closeUpdateAvatarModal();
      if (choiceType === 'list' && deleteToken) await deleteFile(deleteToken);
    }
  };

  setSecureUrl = (secureUrl, deleteToken) =>
    this.setState({ secureUrl, deleteToken });

  render() {
    const {
      showUpdateAvatarModal,
      closeUpdateAvatarModal,
      currentUser: { id },
    } = this.props;
    const { choiceType, activeItem, secureUrl } = this.state;
    return (
      <Mutation
        mutation={UPDATE_AVATAR_MUTATION}
        refetchQueries={[
          { query: USER_QUERY, variables: { id } },
          { query: CURRENT_USER_QUERY },
        ]}
      >
        {(updateAvatar, { loading, error }) => (
          <UpdateAvatarModalStyles
            closeIcon
            open={showUpdateAvatarModal}
            onClose={closeUpdateAvatarModal}
          >
            <Modal.Header>Thay đổi avatar</Modal.Header>
            <Modal.Content>
              <Modal.Description>
                <Header
                  as="h2"
                  attached="top"
                  onClick={() => this.setState({ choiceType: 'list' })}
                >
                  <Radio
                    name="choiceType"
                    value="list"
                    checked={choiceType === 'list'}
                    onChange={this.handleChange}
                  />
                  Chọn avatar có sẵn
                </Header>
                <Segment attached>{this.renderAvatarList()}</Segment>
                <Header
                  as="h2"
                  attached="top"
                  onClick={() => this.setState({ choiceType: 'upload' })}
                >
                  <Radio
                    name="choiceType"
                    value="upload"
                    checked={choiceType === 'upload'}
                    onChange={this.handleChange}
                  />
                  Tải ảnh mới lên
                </Header>
                <CloudinaryUploadAvatar
                  chooseUpload={this.chooseUpload}
                  setSecureUrl={this.setSecureUrl}
                />
              </Modal.Description>
              <Error error={error} />
            </Modal.Content>
            <Modal.Actions>
              <Button
                primary
                icon
                labelPosition="left"
                size="big"
                disabled={
                  loading ||
                  !choiceType ||
                  (choiceType === 'list' && !activeItem) ||
                  (choiceType === 'upload' && !secureUrl)
                }
                onClick={() => this.onSubmit(updateAvatar)}
              >
                <Icon name="check" />
                {loading && 'Đang '}Xác nhận
              </Button>
              <Button
                type="button"
                icon
                labelPosition="left"
                size="big"
                onClick={closeUpdateAvatarModal}
              >
                <Icon name="cancel" />
                Huỷ
              </Button>
            </Modal.Actions>
          </UpdateAvatarModalStyles>
        )}
      </Mutation>
    );
  }
}

UpdateAvatarModal.propTypes = {
  showUpdateAvatarModal: PropTypes.bool,
  closeUpdateAvatarModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

UpdateAvatarModal.defaultProps = {
  showUpdateAvatarModal: false,
};

export default UpdateAvatarModal;
