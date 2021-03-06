import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Loader,
  Progress,
  Button,
  Icon,
  Image,
  Input,
  Header,
  Segment,
} from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { uploadAvatar } from '../../lib/cloudinaryUpload';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import {
  useCloudinaryAuthAvatarMutation,
  useCurrentUserQuery,
} from './authHooks';

const CloudinaryUploadAvatar = ({ chooseUpload, setSecureUrl }) => {
  const [startingUpload, setStartingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [secureUrlState, setSecureUrlState] = useState('');
  const [deleteToken, setDeleteToken] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');

  const {
    loading,
    error,
    data: cloudinaryAuthData,
  } = useCloudinaryAuthAvatarMutation();
  const { currentUser, loading: loadingUser } = useCurrentUserQuery();

  const fileInputRef = useRef(null);

  const onDeleteFileSubmit = async () => {
    setUploadProgress(0);
    setSecureUrlState('');

    const res = await deleteFile(deleteToken);

    if (res.status === 200) {
      setDeleteToken('');
    }
  };

  const onUploadFileSubmit = async e => {
    const { id } = currentUser;

    // Reset uploadError display and assign appropriate value to file
    setUploadError(false);
    const { cloudinaryAuthAvatar } = cloudinaryAuthData;

    const file = e ? e.target.files[0] : uploadImageUrl;

    if (!file) return; // Do nothing if no file selected

    if (deleteToken) await onDeleteFileSubmit();

    // More initial state reset
    setUploadProgress(0);
    setDeleteToken('');
    setSecureUrlState('');
    // Prepare cloudinary upload params
    const { url, data } = uploadAvatar(file, id, cloudinaryAuthAvatar);
    // Upload file with post request
    try {
      const {
        data: { secure_url: secureUrl, delete_token: newDeleteToken },
      } = await axios({
        method: 'post',
        url,
        data,
        onUploadProgress: p => {
          // Show upload progress
          setUploadProgress(Math.floor((p.loaded / p.total) * 100));
        },
      });
      chooseUpload();
      setSecureUrl(secureUrl, newDeleteToken);
      setSecureUrlState(secureUrl);
      setDeleteToken(newDeleteToken);
    } catch {
      setUploadError(true);
    }
  };

  if (loading || loadingUser) return <Loader inline="centered" active />;
  if (error) return <Error error={error} />;

  return (
    <Segment
      attached
      loading={
        startingUpload &&
        !uploadError &&
        !(uploadProgress > 0 && uploadProgress < 100)
      }
    >
      {(!uploadError && uploadProgress > 0 && uploadProgress < 100 && (
        <Progress percent={uploadProgress} progress success />
      )) ||
        (secureUrlState && (
          <>
            <Header as="h3">Uploaded image:</Header>
            <Button negative onClick={onDeleteFileSubmit} type="button">
              remove
            </Button>
            <Image src={secureUrlState} />
          </>
        )) || (
          <>
            {uploadError && (
              <Progress percent={100} error>
                Network error or invalid image file. Try again later
              </Progress>
            )}
            <Button
              type="button"
              positive
              size="huge"
              className="choose-file-button"
              content="Choose file"
              labelPosition="left"
              icon="file image"
              onClick={() => {
                fileInputRef.current.click();
              }}
            />
            <input
              hidden
              ref={fileInputRef}
              onClick={() => chooseUpload()}
              type="file"
              id="file"
              name="file"
              accept=".jpg,.png"
              onChange={async e => {
                setStartingUpload(true);
                await onUploadFileSubmit(e);
                setStartingUpload(false);
              }}
            />
            <Header>- OR -</Header>
            <Header as="h3">Provide URL:</Header>
            <div className="uploadImageUrl">
              <Input
                onClick={() => chooseUpload()}
                label="URL"
                placeholder="file.jpg"
                type="text"
                id="uploadImageUrl"
                name="uploadImageUrl"
                onChange={e => setUploadImageUrl(e.target.value)}
              />
              <Button
                positive
                onClick={async () => {
                  setStartingUpload(true);
                  await onUploadFileSubmit();
                  setStartingUpload(false);
                }}
              >
                <Icon name="upload" />
                Upload
              </Button>
            </div>
          </>
        )}
    </Segment>
  );
};

CloudinaryUploadAvatar.propTypes = {
  setSecureUrl: PropTypes.func.isRequired,
  chooseUpload: PropTypes.func.isRequired,
};

export default CloudinaryUploadAvatar;