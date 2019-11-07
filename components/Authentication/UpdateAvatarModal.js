import React, { useState } from 'react';
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

const UpdateAvatarModal = ({
  showUpdateAvatarModal,
  closeUpdateAvatarModal,
  currentUser: { id },
}) => {
  const [choiceType, setChoiceType] = useState(null);
  const [activeItem, setActiveItem] = useState('');
  const [secureUrlState, setSecureUrlState] = useState('');
  const [deleteTokenState, setDeleteTokenState] = useState('');

  const setChoiceTypeList = () => setChoiceType('list');

  const setChoiceTypeUpload = () => {
    setChoiceType('upload');
  };

  const renderAvatarList = () => (
    <List horizontal selection>
      {avatars.map(avatar => (
        <List.Item
          key={avatar}
          className={activeItem === avatar ? 'selected' : ''}
          onClick={() => {
            setActiveItem(avatar);
            setChoiceTypeList();
          }}
        >
          <Image src={`../../static/avatar/large/${avatar}`} size="tiny" />
        </List.Item>
      ))}
    </List>
  );

  const onSubmit = async updateAvatar => {
    const avatar =
      choiceType === 'list'
        ? `/static/avatar/large/${activeItem}`
        : choiceType === 'upload'
        ? secureUrlState
        : '';

    const { data } = await updateAvatar({ variables: { avatar } });
    if (data) {
      closeUpdateAvatarModal();
      if (choiceType === 'list' && deleteTokenState)
        await deleteFile(deleteTokenState);
    }
  };

  const setSecureUrl = (secureUrl, deleteToken) => {
    setSecureUrlState(secureUrl);
    setDeleteTokenState(deleteToken);
  };

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
              <Header as="h2" attached="top" onClick={setChoiceTypeList}>
                <Radio
                  name="choiceType"
                  value="list"
                  checked={choiceType === 'list'}
                  onChange={setChoiceTypeList}
                />
                Chọn avatar có sẵn
              </Header>
              <Segment attached>{renderAvatarList()}</Segment>
              <Header as="h2" attached="top" onClick={setChoiceTypeUpload}>
                <Radio
                  name="choiceType"
                  value="upload"
                  checked={choiceType === 'upload'}
                  onChange={setChoiceTypeUpload}
                />
                Tải ảnh mới lên
              </Header>
              <CloudinaryUploadAvatar
                chooseUpload={setChoiceTypeUpload}
                setSecureUrl={setSecureUrl}
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
                (choiceType === 'upload' && !secureUrlState)
              }
              onClick={() => onSubmit(updateAvatar)}
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
};

UpdateAvatarModal.propTypes = {
  showUpdateAvatarModal: PropTypes.bool,
  closeUpdateAvatarModal: PropTypes.func.isRequired,
  currentUser: PropTypes.object.isRequired,
};

UpdateAvatarModal.defaultProps = {
  showUpdateAvatarModal: false,
};

export default UpdateAvatarModal;
