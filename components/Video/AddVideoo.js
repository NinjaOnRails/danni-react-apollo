import React, { Component } from 'react';
import { Icon, Segment, Form, Button, Loader } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import { defaultLanguage } from '../../lib/supportedLanguages';
import Error from '../UI/ErrorMessage';
import { ALL_VIDEOS_QUERY, ALL_AUDIOS_QUERY } from '../../graphql/query';
import VideoForm from './VideoForm';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { trackNewVideo } from '../../lib/mixpanel';
import {
  CREATE_AUDIO_MUTATION,
  CREATE_VIDEO_MUTATION,
} from '../../graphql/mutation';
import { contentLanguageQuery } from '../UI/ContentLanguage';
import AddVideoSteps from './AddVideoSteps';
import AudioForm from './AudioForm';
import AddVideoStyles from '../styles/AddVideoStyles';

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
    audioUrl: '',
    tags: '',
    isAudioSource: true,
    isTags: true,
    secureUrl: '',
    deleteToken: '',
    error: '',
    audioDuration: 0,
    redirecting: false,
  };

  handleChange = (e, { name, value }) => {
    // Check video source input to refetch preview if necessary
    this.setState({ [name]: value, error: '' });
  };

  setAddVideoState = state => this.setState(state);

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

      this.setState({ redirecting: true });

      // Mixpanel send stat
      trackNewVideo(language);

      // Redirect to newly created Video watch page
      return Router.push({
        pathname: '/watch',
        query: { id, audioId },
      });
    }
    this.setState({ redirecting: true });
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
      videoValid,
      audioUrl,
      secureUrl,
      deleteToken,
      redirecting,
    } = this.state;
    if (redirecting)
      return (
        <Loader indeterminate active>
          Đang chuyển trang...
        </Loader>
      );
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
                loading={loadingCreateAudio || loadingCreateVideo}
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
                  <AudioForm
                    setAddVideoState={this.setAddVideoState}
                    isAudioSource={isAudioSource}
                    audioUrl={audioUrl}
                    secureUrl={secureUrl}
                    deleteToken={deleteToken}
                    language={language}
                    source={source}
                    onDeleteFileSubmit={this.onDeleteFileSubmit}
                    youtubeId={youtubeId}
                  />
                ) : (
                  <>
                    <Form.Input
                      label="YouTube link hoặc ID"
                      placeholder="youtube.com/watch?v=36A5bOSP334 hoặc 36A5bOSP334"
                    />
                    <Button
                      type="button"
                      icon
                      labelPosition="right"
                      primary
                      onClick={() => {
                        this.setState({ activeStep: 'details' });
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
