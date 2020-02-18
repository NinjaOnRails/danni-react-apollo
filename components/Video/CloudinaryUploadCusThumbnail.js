import { useState, useEffect, useRef } from 'react';
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
import PropTypes from 'prop-types';
import axios from 'axios';
import Error from '../UI/ErrorMessage';
import { uploadCusThumbnail } from '../../lib/cloudinaryUpload';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { useCloudinaryAuthCustomThumbnail } from './videoHooks';
import { useCurrentUserQuery } from '../Authentication/authHooks';

const CloudinaryUploadCusThumbnail = ({
  youtubeId,
  language,
  oldCusThumbnail,
  setCusThumbnailUrl,
}) => {
  const [startingUpload, setStartingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [secureUrl, setSecureUrl] = useState('');
  const [deleteToken, setDeleteToken] = useState('');
  const [uploadImageUrl, setUploadImageUrl] = useState('');

  const fileInputRef = useRef(null);

  const { error, loading, data } = useCloudinaryAuthCustomThumbnail(
    youtubeId,
    language
  );
  const { loading: loadingUser, currentUser } = useCurrentUserQuery();

  useEffect(() => {
    if (oldCusThumbnail) setSecureUrl(oldCusThumbnail);
  }, []);

  if (loading || loadingUser) return <Loader inline="centered" active />;
  if (error) return <Error error={error} />;
  const { id } = currentUser;
  const { cloudinaryAuthCusThumbnail } = data;

  const onDeleteFileSubmit = async () => {
    setUploadProgress(0);
    setSecureUrl('');

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setDeleteToken('');
    }
  };

  const onUploadFileSubmit = async e => {
    // Reset uploadError display and assign appropriate value to file
    setUploadError(false);
    const file = e ? e.target.files[0] : uploadImageUrl;

    if (!file) return; // Do nothing if no file selected

    if (deleteToken) await onDeleteFileSubmit();

    // More initial state reset
    setUploadProgress(0);
    setDeleteToken('');
    setSecureUrl('');

    // Prepare cloudinary upload params
    const { url, data } = uploadCusThumbnail(
      file,
      id,
      cloudinaryAuthCusThumbnail,
      youtubeId,
      language
    );

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
      setCusThumbnailUrl(secureUrl, newDeleteToken);
      setSecureUrl(secureUrl);
      setDeleteToken(newDeleteToken);
    } catch {
      setUploadError(true);
    }
  };

  return (
    <>
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
          (secureUrl && (
            <>
              <Header as="h3">Ảnh được tải lên:</Header>
              <Button negative onClick={onDeleteFileSubmit} type="button">
                Xoá
              </Button>
              <Image src={secureUrl} />
            </>
          )) || (
            <>
              {uploadError && (
                <Progress percent={100} error>
                  Lỗi mạng hoặc ảnh có vấn đề. Vui lòng thử sau.
                </Progress>
              )}
              <Button
                type="button"
                positive
                size="huge"
                className="choose-file-button"
                content="Chọn ảnh trong máy"
                labelPosition="left"
                icon="file image"
                onClick={() => {
                  fileInputRef.current.click();
                }}
              />
              <input
                hidden
                ref={fileInputRef}
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
              <Header>hoặc</Header>
              <Header as="h3">Tải từ đường link:</Header>
              <div className="uploadImageUrl">
                <Input
                  label="URL"
                  placeholder="file.jpg"
                  type="text"
                  id="uploadImageUrl"
                  name="uploadImageUrl"
                  onChange={({ target: { value } }) => setUploadImageUrl(value)}
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
                  Tải lên
                </Button>
              </div>
            </>
          )}
      </Segment>
    </>
  );
};

CloudinaryUploadCusThumbnail.propTypes = {
  setCusThumbnailUrl: PropTypes.func.isRequired,
  youtubeId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  oldCusThumbnail: PropTypes.string,
};

CloudinaryUploadCusThumbnail.defaultProps = {
  oldCusThumbnail: undefined,
};

export default CloudinaryUploadCusThumbnail;
