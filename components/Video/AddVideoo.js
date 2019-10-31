import React, { Component } from 'react';
import { Icon, Segment, Form, Button, Loader } from 'semantic-ui-react';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import axios from 'axios';
import { defaultLanguage } from '../../lib/supportedLanguages';
import Error from '../UI/ErrorMessage';
import { ALL_VIDEOS_QUERY, ALL_AUDIOS_QUERY } from '../../graphql/query';
import VideoForm from './VideoForm';
import { uploadAudio } from '../../lib/cloudinaryUpload';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { trackNewVideo } from '../../lib/mixpanel';
import {
  CREATE_AUDIO_MUTATION,
  CREATE_VIDEO_MUTATION,
} from '../../graphql/mutation';
import { contentLanguageQuery } from '../UI/ContentLanguage';
import AddVideoSteps from './AddVideoSteps';
import AudioForm from './AudioForm';

const AddVideoStyles = styled.div`
  max-width: 600px;
  margin: auto;

  .ui.steps .step .title {
    font-family: ${props => props.theme.font};
  }

  form.ui.form {
    height: 525.69px;
  }

  div.buttons {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  @media (max-width: 567px) {
    .ui.fluid.steps {
      display: none;
    }
  }
`;

/* eslint-disable */
const createAudioMutation = ({
  contentLanguageQuery: { contentLanguage },
  render,
}) => (
  <Mutation
    mutation={CREATE_AUDIO_MUTATION}
    refetchQueries={[
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
    ]}
  >
    {(createAudio, createAudioResult) =>
      render({ createAudio, createAudioResult })
    }
  </Mutation>
);

const createVideoMutation = ({
  youtubeId,
  language,
  isAudioSource,
  contentLanguageQuery: { contentLanguage },
  render,
}) => (
  <Mutation
    mutation={CREATE_VIDEO_MUTATION}
    variables={{
      source: youtubeId,
      language: isAudioSource ? null : language,
    }}
    refetchQueries={[
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    ]}
  >
    {(createVideo, createVideoResult) =>
      render({ createVideo, createVideoResult })
    }
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  contentLanguageQuery,
  createAudioMutation,
  createVideoMutation,
});

export default class AddVideo extends Component {
  state = {
    activeStep: 'video',
    language: defaultLanguage,
    source: '',
    videoValid: false,
    originTags: [],
    youtubeId: '',
    title: '',
    description: '',
    isDescription: true,
    audioSource: '',
    tags: '',
    isAudioSource: false,
    isTags: true,
    secureUrl: '',
    uploadProgress: 0,
    uploadError: false,
    deleteToken: '',
    error: '',
    audioDuration: 0,
  };

  handleChange = (e, { name, value }) => {
    // Check video source input to refetch preview if necessary
    this.setState({ [name]: value, error: '' });
  };

  setAddVideoState = state => this.setState(state);

  onUploadFileSubmit = async (cloudinaryAuthAudio, id, e) => {
    // Reset uploadError display and assign appropriate value to file
    this.setState({ uploadError: false, error: '' });
    const { audioSource, youtubeId, language, deleteToken } = this.state;
    const file = e ? e.target.files[0] : audioSource;

    if (!file) return; // Do nothing if no file selected

    if (deleteToken) await this.onDeleteFileSubmit();

    // More initial state reset
    this.setState({
      uploadProgress: 0,
      deleteToken: '',
      secureUrl: '',
    });

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
      this.setState({
        secureUrl,
        deleteToken: newDeleteToken,
        audioSource: '',
      });
    } catch (err) {
      this.setState({
        uploadError: true,
      });
    }
  };

  onDeleteFileSubmit = async () => {
    const { deleteToken } = this.state;
    this.setState({
      uploadProgress: 0,
      secureUrl: '',
      error: '',
    });

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      this.setState({
        deleteToken: '',
      });
    }
  };

  onAudioLoadedMetadata = e => {
    this.setState({ audioDuration: Math.round(e.target.duration) });
  };

  onFormSubmit = async (e, createAudio, createVideo) => {
    const {
      language,
      tags,
      title,
      description,
      isAudioSource,
      defaultVolume,
      isDefaultVolume,
      secureUrl,
      audioDuration,
      isDescription,
      isTags,
      deleteToken,
    } = this.state;

    // Stop form from submitting
    e.preventDefault();

    this.setState({ error: '' });

    if (isAudioSource && !secureUrl)
      return this.setState({
        error: 'You have not uploaded an audio file yet',
      });

    // Call createVideo mutation
    const {
      data: {
        createVideo: { id, duration },
      },
    } = await createVideo();

    // Call createAudio mutation
    if (secureUrl && isAudioSource) {
      // Check if audio file's duration is within 30s of video's duration
      // if (Math.abs(duration - audioDuration) > 30) {
      //   return this.setState({
      //     error:
      //       'File audio của bạn không được chênh lệch quá 30 giây so với độ dài của YouTube video',
      //   });
      // }

      const {
        data: {
          createAudio: { id: audioId },
        },
      } = await createAudio({
        variables: {
          video: id,
          source: secureUrl,
          duration: audioDuration,
          language,
          title,
          description: isDescription ? description : undefined,
          tags: isTags ? tags : undefined,
          defaultVolume: isDefaultVolume ? defaultVolume : undefined,
        },
      });

      // Mixpanel send stat
      trackNewVideo(language);

      // Redirect to newly created Video watch page
      return Router.push({
        pathname: '/watch',
        query: { id, audioId },
      });
    }
    if (deleteToken) this.onDeleteFileSubmit();

    // Mixpanel send stat
    trackNewVideo();

    return Router.push({
      pathname: '/watch',
      query: { id },
    });
  };

  render() {
    const {
      activeStep,
      error,
      language,
      source,
      youtubeId,
      isAudioSource,
      videoValid
    } = this.state;
    return (
      <Composed
        youtubeId={youtubeId}
        language={language}
        isAudioSource={isAudioSource}
      >
        {({
          createAudioMutation: {
            createAudio,
            createAudioResult: {
              loading: loadingCreateAudio,
              error: errorCreateAudio,
            },
          },
          createVideoMutation: {
            createVideo,
            createVideoResult: {
              loading: loadingCreateVideo,
              error: errorCreateVideo,
            },
          },
        }) => (
          <AddVideoStyles>
            <AddVideoSteps activeStep={activeStep} />
            <Segment>
              <Error error={errorCreateAudio} />
              <Error error={errorCreateVideo} />
              <Error error={{ message: error }} />
              <Form
                size="big"
                onSubmit={async e =>
                  this.onFormSubmit(e, createAudio, createVideo)
                }
              >
                {activeStep === 'video' ? (
                  <VideoForm
                    setAddVideoState={this.setAddVideoState}
                    language={language}
                    source={source}
                    youtubeId={youtubeId}
                    videoValid={videoValid}
                  />
                ) : activeStep === 'audio' ? (
                  <AudioForm setAddVideoState={this.setAddVideoState}/>
                ) : (
                  <>
                    <Form.Input
                      label="YouTube link hoặc ID"
                      placeholder="youtube.com/watch?v=36A5bOSP334 hoặc 36A5bOSP334"
                    />
                    <Button
                      icon
                      labelPosition="right"
                      primary
                      onClick={() => {
                        this.setState({ activeStep: 'info' });
                      }}
                    >
                      Tiếp
                      <Icon name="right arrow" />
                    </Button>
                  </>
                )}
              </Form>
            </Segment>
          </AddVideoStyles>
        )}
      </Composed>
    );
  }
}
