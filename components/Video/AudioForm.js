import { useState, createRef } from 'react';
import {
  Button,
  Form,
  Icon,
  Segment,
  Header,
  Radio,
  Loader,
  Progress,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Error from '../UI/ErrorMessage';
import { uploadAudio } from '../../lib/cloudinaryUpload';
import { useCloudinaryAuthAudioQuery } from './videoHooks';
import { useCurrentUserQuery } from '../Authentication/authHooks';

const AudioForm = ({
  setAddVideoState,
  isAudioSource,
  audioUrl,
  language,
  youtubeId,
  secureUrl,
  onDeleteFileSubmit,
  deleteToken,
  editVideo,
}) => {
  const [startingUpload, setStartingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fileInputRef = createRef();

  const { loading, error: queryError, data } = useCloudinaryAuthAudioQuery(
    youtubeId,
    language
  );
  const { currentUser, loading: loadingUser } = useCurrentUserQuery();

  if (loading || loadingUser) return <Loader active />;
  if (queryError) return <Error error={queryError} />;
  const { id } = currentUser;

  const onUploadFileSubmit = async (cloudinaryAuthAudio, e) => {
    // Reset uploadError display and assign appropriate value to file
    setUploadError(false);
    setError(null);
    const file = e ? e.target.files[0] : audioUrl;

    if (!file) return; // Do nothing if no file selected

    // More initial state reset
    setUploadProgress(0);

    setAddVideoState({ deleteToken: '', secureUrl: '' });

    // Prepare cloudinary upload params
    const { url, data } = uploadAudio(
      file,
      youtubeId,
      language,
      id,
      cloudinaryAuthAudio
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
      setAddVideoState({
        secureUrl,
        deleteToken: newDeleteToken,
        audioUrl: '',
      });
    } catch (err) {
      setUploadError(true);
    }
  };

  const onUploadButtonClick = async cloudinaryAuthAudio => {
    setAddVideoState({ isAudioSource: true });
    setStartingUpload(true);
    await onUploadFileSubmit(cloudinaryAuthAudio, id);
    setStartingUpload(false);
  };

  const onNextButtonClick = () => {
    if (secureUrl) {
      setAddVideoState({ activeStep: 'details' });
    } else {
      setError({
        message:
          'Vui lòng tải file thuyết minh lên hoặc chọn "Video đã có thuyết minh" để tiếp tục',
      });
    }
  };

  const onAudioLoadedMetadata = e => {
    setAddVideoState({ audioDuration: Math.round(e.target.duration) });
  };
  return (
    <>
      {!editVideo && (
        <Header
          as="h2"
          attached="top"
          onClick={() => {
            setAddVideoState({ isAudioSource: true });
          }}
        >
          <Radio value="upload" checked={isAudioSource} />
          Upload audio file
        </Header>
      )}
      <Segment attached>
        {(uploadProgress > 0 && uploadProgress < 100 && (
          <Progress percent={uploadProgress} progress success />
        )) ||
          (secureUrl && (
            <>
              <Header as="h3">Uploaded file:</Header>
              <audio
                controls
                src={secureUrl}
                onLoadedMetadata={onAudioLoadedMetadata}
              >
                <track kind="captions" />
              </audio>
              <Button negative onClick={onDeleteFileSubmit} type="button">
                remove
              </Button>
            </>
          )) ||
          ((startingUpload || deleteToken) && (
            <Loader inline="centered" active />
          )) || (
            <>
              {uploadError && (
                <Progress percent={100} error>
                  Network error or invalid file.
                </Progress>
              )}
              <div className="audioUrl">
                <Form.Input
                  onClick={() => setAddVideoState({ isAudioSource: true })}
                  onChange={(e, { value }) => {
                    setAddVideoState({ audioUrl: value });
                  }}
                  defaultValue={audioUrl}
                  name="audioUrl"
                  label="Link (URL)"
                  placeholder="spotify.com/audiofile.mp3"
                />
                <Button
                  positive
                  onClick={() => onUploadButtonClick(data.cloudinaryAuthAudio)}
                >
                  <Icon name="upload" />
                  Upload
                </Button>
              </div>
              <Header>- OR -</Header>
              <Button
                type="button"
                positive
                size="huge"
                className="choose-file-button"
                content="Choose file"
                labelPosition="left"
                icon="file audio"
                onClick={() => {
                  setAddVideoState({ isAudioSource: true });
                  fileInputRef.current.click();
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                id="file"
                name="file"
                accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                hidden
                onChange={async e => {
                  setStartingUpload(true);
                  await onUploadFileSubmit(data.cloudinaryAuthAudio, e);
                  setStartingUpload(false);
                }}
              />
            </>
          )}
      </Segment>
      {!editVideo && (
        <Segment>
          <Header
            as="h2"
            onClick={() => {
              setAddVideoState({ isAudioSource: false });
            }}
          >
            <Radio value="upload" checked={!isAudioSource} />
            Video already dubbed
          </Header>
        </Segment>
      )}
      <Error error={error} />
      {!editVideo && (
        <div className="buttons">
          <Button
            size="big"
            icon
            labelPosition="left"
            onClick={() => setAddVideoState({ activeStep: 'video' })}
          >
            Back
            <Icon name="left arrow" />
          </Button>
          {isAudioSource ? (
            <Button
              disabled={
                startingUpload || (uploadProgress > 0 && uploadProgress < 100)
              }
              type="button"
              size="big"
              icon
              labelPosition="right"
              primary
              onClick={onNextButtonClick}
            >
              Next
              <Icon name="right arrow" />
            </Button>
          ) : (
            <Button type="submit" size="big" icon labelPosition="right" primary>
              Submit
              <Icon name="check" />
            </Button>
          )}
        </div>
      )}
    </>
  );
};

AudioForm.propTypes = {
  setAddVideoState: PropTypes.func.isRequired,
  onDeleteFileSubmit: PropTypes.func.isRequired,
  isAudioSource: PropTypes.bool.isRequired,
  audioUrl: PropTypes.string.isRequired,
  secureUrl: PropTypes.string.isRequired,
  deleteToken: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
  editVideo: PropTypes.bool,
};

AudioForm.defaultProps = {
  editVideo: false,
};

export default AudioForm;
