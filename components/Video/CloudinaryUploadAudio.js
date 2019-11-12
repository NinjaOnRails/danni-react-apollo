import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Loader, Progress, Button, Icon } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import { useCloudinaryAuthAudioQuery } from './videoHooks';
import { useCurrentUserQuery } from '../Authentication/authHooks';

const CloudinaryUploadAudio = ({
  source,
  language,
  onUploadFileSubmit,
  uploadProgress,
  uploadError,
  deleteToken,
  onDeleteFileSubmit,
  secureUrl,
  handleChange,
  audioSource,
  onAudioLoadedMetadata,
}) => {
  const [startingUpload, setStartingUpload] = useState(false);

  const { currentUser, loading: loadingUser } = useCurrentUserQuery();

  const { loading, error, data } = useCloudinaryAuthAudioQuery(
    source,
    language
  );

  if (loading || loadingUser) return <Loader inline="centered" active />;
  if (error) return <Error>Error: {error.message}</Error>;
  const { id } = currentUser;

  return (
    <>
      {(uploadError && (
        <Progress percent={100} error>
          Network Error. Try again later.
        </Progress>
      )) ||
        (uploadProgress > 0 && uploadProgress < 100 && (
          <Progress percent={uploadProgress} progress success />
        )) ||
        (secureUrl && (
          <>
            <p>Uploaded File:</p>
            <audio
              controls
              src={secureUrl}
              onLoadedMetadata={e => onAudioLoadedMetadata(e)}
            >
              <track kind="captions" />
            </audio>
            <Button negative onClick={onDeleteFileSubmit} type="button">
              Remove
            </Button>
          </>
        )) ||
        ((startingUpload || deleteToken) && (
          <Loader inline="centered" active />
        )) || (
          <>
            <label htmlFor="file">
              Choose a Local File:
              <input
                type="file"
                id="file"
                name="file"
                accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                onChange={async e => {
                  setStartingUpload(true);
                  await onUploadFileSubmit(data.cloudinaryAuthAudio, id, e);
                  setStartingUpload(false);
                }}
              />
            </label>
            OR
            <label htmlFor="audioSource">
              Provide a Direct Link:
              <Button
                type="button"
                floated="right"
                positive
                onClick={async () => {
                  setStartingUpload(true);
                  await onUploadFileSubmit(data.cloudinaryAuthAudio, id);
                  setStartingUpload(false);
                }}
              >
                <Icon name="upload" />
                Upload
              </Button>
              <input
                type="text"
                name="audioSource"
                value={audioSource}
                onChange={handleChange}
              />
            </label>
          </>
        )}
    </>
  );
};

CloudinaryUploadAudio.propTypes = {
  source: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  deleteToken: PropTypes.string.isRequired,
  secureUrl: PropTypes.string.isRequired,
  uploadError: PropTypes.bool.isRequired,
  onUploadFileSubmit: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  handleChange: PropTypes.func.isRequired,
  onAudioLoadedMetadata: PropTypes.func.isRequired,
  audioSource: PropTypes.string.isRequired,
};

export default CloudinaryUploadAudio;
