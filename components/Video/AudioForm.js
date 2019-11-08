import React, { useState } from 'react';
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
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { CLOUDINARY_AUTH_AUDIO } from '../../graphql/query';
import { user } from '../UI/ContentLanguage';
import { uploadAudio } from '../../lib/cloudinaryUpload';

/* eslint-disable */
const cloudinaryAuthAudioQuery = ({ youtubeId, language, render }) => (
  /* eslint-enable */
  <Query
    query={CLOUDINARY_AUTH_AUDIO}
    variables={{
      source: youtubeId,
      language,
    }}
  >
    {render}
  </Query>
);

const Composed = adopt({
  cloudinaryAuthAudioQuery,
  user,
});

const AudioForm = ({
  setAddVideoState,
  isAudioSource,
  audioUrl,
  language,
  youtubeId,
  secureUrl,
  onDeleteFileSubmit,
  deleteToken,
}) => {
  const [startingUpload, setStartingUpload] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const fileInputRef = React.createRef();

  const onUploadFileSubmit = async (cloudinaryAuthAudio, id, e) => {
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

  const onUploadButtonClick = async (cloudinaryAuthAudio, id) => {
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

  return (
    <Composed youtubeId={youtubeId} language={language}>
      {({
        cloudinaryAuthAudioQuery: { loading, error: queryError, data },
        user: { currentUser, loading: loadingUser },
      }) => {
        if (loading || loadingUser) return <Loader active />;
        if (queryError) return <Error error={queryError} />;
        const { id } = currentUser;

        return (
          <>
            <Header
              as="h2"
              attached="top"
              onClick={() => {
                setAddVideoState({ isAudioSource: true });
              }}
            >
              <Radio value="upload" checked={isAudioSource} />
              Tải file thuyết minh lên
            </Header>
            <Segment attached>
              {(uploadProgress > 0 && uploadProgress < 100 && (
                <Progress percent={uploadProgress} progress success />
              )) ||
                (secureUrl && (
                  <>
                    <Header as="h3">File được tải lên:</Header>
                    <audio controls src={secureUrl}>
                      <track kind="captions" />
                    </audio>
                    <Button negative onClick={onDeleteFileSubmit} type="button">
                      xoá
                    </Button>
                  </>
                )) ||
                ((startingUpload || deleteToken) && (
                  <Loader inline="centered" active />
                )) || (
                  <>
                    {uploadError && (
                      <Progress percent={100} error>
                        Lỗi mạng hoặc file không hợp lệ.
                      </Progress>
                    )}
                    <div className="audioUrl">
                      <Form.Input
                        onClick={() =>
                          setAddVideoState({ isAudioSource: true })
                        }
                        onChange={(e, { value }) => {
                          setAddVideoState({ audioUrl: value });
                        }}
                        value={audioUrl}
                        name="audioUrl"
                        label="Đường link (URL)"
                        placeholder="spotify.com/audiofile.mp3"
                      />
                      <Button
                        positive
                        onClick={() =>
                          onUploadButtonClick(data.cloudinaryAuthAudio, id)
                        }
                      >
                        <Icon name="upload" />
                        Tải lên
                      </Button>
                    </div>
                    <Header>hoặc</Header>
                    <Button
                      type="button"
                      positive
                      size="huge"
                      className="choose-file-button"
                      content="Chọn file trong máy"
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
                        await onUploadFileSubmit(
                          data.cloudinaryAuthAudio,
                          id,
                          e
                        );
                        setStartingUpload(false);
                      }}
                    />
                  </>
                )}
            </Segment>

            <Segment>
              <Header
                as="h2"
                onClick={() => {
                  setAddVideoState({ isAudioSource: false });
                }}
              >
                <Radio value="upload" checked={!isAudioSource} />
                Video đã có sẵn thuyết minh
              </Header>
            </Segment>

            <Error error={error} />

            <div className="buttons">
              <Button
                size="big"
                icon
                labelPosition="left"
                onClick={() => setAddVideoState({ activeStep: 'video' })}
              >
                Quay lại
                <Icon name="left arrow" />
              </Button>
              {isAudioSource ? (
                <Button
                  disabled={
                    startingUpload ||
                    (uploadProgress > 0 && uploadProgress < 100)
                  }
                  type="button"
                  size="big"
                  icon
                  labelPosition="right"
                  primary
                  onClick={onNextButtonClick}
                >
                  Tiếp tục
                  <Icon name="right arrow" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="big"
                  icon
                  labelPosition="right"
                  primary
                >
                  Xác nhận
                  <Icon name="check" />
                </Button>
              )}
            </div>
          </>
        );
      }}
    </Composed>
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
  source: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
};

export default AudioForm;
