import React, { Component } from 'react';
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

export default class AudioForm extends Component {
  state = {
    uploadProgress: 0,
    startingUpload: false,
    uploadError: false,
    error: null,
  };

  fileInputRef = React.createRef();

  onUploadFileSubmit = async (cloudinaryAuthAudio, id, e) => {
    const { setAddVideoState, audioUrl, youtubeId, language } = this.props;

    // Reset uploadError display and assign appropriate value to file
    this.setState({ uploadError: false, error: null });
    const file = e ? e.target.files[0] : audioUrl;

    if (!file) return; // Do nothing if no file selected

    // More initial state reset
    this.setState({
      uploadProgress: 0,
    });
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
          this.setState({
            uploadProgress: Math.floor((p.loaded / p.total) * 100),
          });
        },
      });
      setAddVideoState({
        secureUrl,
        deleteToken: newDeleteToken,
        audioUrl: '',
      });
    } catch (err) {
      this.setState({
        uploadError: true,
      });
    }
  };

  onUploadButtonClick = async (cloudinaryAuthAudio, id) => {
    const { setAddVideoState } = this.props;
    setAddVideoState({ isAudioSource: true });
    this.setState({ startingUpload: true });
    await this.onUploadFileSubmit(cloudinaryAuthAudio, id);
    this.setState({ startingUpload: false });
  };

  onNextButtonClick = () => {
    const { setAddVideoState, secureUrl } = this.props;
    if (secureUrl) {
      setAddVideoState({ activeStep: 'details' });
    } else {
      this.setState({
        error: {
          message:
            'Vui lòng tải file thuyết minh lên hoặc chọn "Video đã có thuyết minh" để tiếp tục',
        },
      });
    }
  };

  render() {
    const {
      setAddVideoState,
      isAudioSource,
      audioUrl,
      language,
      youtubeId,
      secureUrl,
      onDeleteFileSubmit,
      deleteToken,
    } = this.props;

    const { uploadError, uploadProgress, startingUpload, error } = this.state;

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
                File thuyết minh riêng
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
                      <Button
                        negative
                        onClick={onDeleteFileSubmit}
                        type="button"
                      >
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
                          label="Đường link URL"
                          placeholder="spotify.com/audiofile.mp3"
                        />
                        <Button
                          positive
                          onClick={() =>
                            this.onUploadButtonClick(
                              data.cloudinaryAuthAudio,
                              id
                            )
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
                          this.fileInputRef.current.click();
                        }}
                      />
                      <input
                        ref={this.fileInputRef}
                        type="file"
                        id="file"
                        name="file"
                        accept=".mp3,.aac,.aiff,.amr,.flac,.m4a,.ogg,.wav"
                        hidden
                        onChange={async e => {
                          this.setState({ startingUpload: true });
                          await this.onUploadFileSubmit(
                            data.cloudinaryAuthAudio,
                            id,
                            e
                          );
                          this.setState({ startingUpload: false });
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
                  Video đã có thuyết minh
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
                    onClick={() => this.onNextButtonClick()}
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
  }
}

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
