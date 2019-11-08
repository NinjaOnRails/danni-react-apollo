import React, { useState } from 'react';
import { Segment, Form, Loader, Header } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import { defaultLanguage } from '../../lib/supportedLanguages';
import Error from '../UI/ErrorMessage';
import {
  ALL_VIDEOS_QUERY,
  ALL_AUDIOS_QUERY,
  CURRENT_USER_QUERY,
  USER_QUERY,
} from '../../graphql/query';
import VideoForm from './VideoForm';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { trackNewVideo } from '../../lib/mixpanel';
import {
  CREATE_AUDIO_MUTATION,
  CREATE_VIDEO_MUTATION,
} from '../../graphql/mutation';
import { contentLanguageQuery, user } from '../UI/ContentLanguage';
import AddVideoSteps from './AddVideoSteps';
import AudioForm from './AudioForm';
import AddVideoStyles from '../styles/AddVideoStyles';
import DetailsForm from './DetailsForm';

/* eslint-disable */
const createAudioMutation = ({
  user: {
    currentUser: { id },
  },
  contentLanguageQuery: { contentLanguage },
  render,
}) => (
  <Mutation
    mutation={CREATE_AUDIO_MUTATION}
    refetchQueries={[
      { query: ALL_AUDIOS_QUERY, variables: { contentLanguage } },
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
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
  user: {
    currentUser: { id },
  },
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
      { query: CURRENT_USER_QUERY },
      { query: USER_QUERY, variables: { id } },
    ]}
  >
    {(createVideo, createVideoResult) =>
      render({ createVideo, createVideoResult })
    }
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  user,
  contentLanguageQuery,
  createAudioMutation,
  createVideoMutation,
});

const AddVideo = () => {
  // const [source, setSource] = useState('');
  // const [youtubeId, setYoutubeId] = useState('');
  // const [title, setTitle] = useState('');
  // const [description, setDescription] = useState('');
  // const [audioUrl, setAudioUrl] = useState('');
  // const [tags, setTags] = useState('');
  // const [secureUrl, setSecureUrl] = useState('');
  // const [deleteToken, setDeleteToken] = useState('');
  // const [error, setError] = useState('');
  // const [activeStep, setActiveStep] = useState('video');
  // const [language, setLanguage] = useState(defaultLanguage);
  // const [videoValid, setVideoValid] = useState(false);
  // const [isAudioSource, setIsAudioSource] = useState(true);
  // const [redirecting, setRedirecting] = useState(false);
  // const [audioDuration, setAudioDuration] = useState(0);

  const [addVideoForm, setAddVideoForm] = useState({
    activeStep: 'video',
    language: defaultLanguage,
    source: '',
    videoValid: false,
    originTags: [],
    youtubeId: '',
    title: '',
    description: '',
    audioUrl: '',
    tags: '',
    isAudioSource: true,
    secureUrl: '',
    deleteToken: '',
    error: '',
    audioDuration: 0,
    redirecting: false,
  });

  const {
    deleteToken,
    isAudioSource,
    secureUrl,
    language,
    title,
    description,
    tags,
    audioDuration,
    redirecting,
    youtubeId,
    activeStep,
    error,
    source,
    videoValid,
    originTags,
    audioUrl,
  } = addVideoForm;

  const setAddVideoState = newState =>
    setAddVideoForm(prevState => ({ ...prevState, ...newState }));

  const onDeleteFileSubmit = async () => {
    setAddVideoState({ secureUrl: '', error: '' });
    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setAddVideoState({ deleteToken: '' });
    }
  };

  const onAudioLoadedMetadata = e => {
    setAddVideoState({ audioDuration: Math.round(e.target.duration) });
  };

  const onFormSubmit = async (e, createAudio, createVideo) => {
    // Stop form from submitting
    e.preventDefault();
    setAddVideoState({ error: '' });
    if (isAudioSource && !secureUrl)
      setAddVideoState({ error: 'You have not uploaded an audio file yet' });

    // Call createVideo mutation
    const {
      data: {
        createVideo: { id },
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
          description,
          tags,
        },
      });
      setAddVideoState({ redirecting: true });

      // Mixpanel send stat
      trackNewVideo(language);

      // Redirect to newly created Video watch page
      return Router.push({
        pathname: '/watch',
        query: { id, audioId },
      });
    }
    setAddVideoState({ redirecting: true });
    if (deleteToken) onDeleteFileSubmit();

    // Mixpanel send stat
    trackNewVideo();

    return Router.push({
      pathname: '/watch',
      query: { id },
    });
  };

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
          <Header>Thêm Video/Thuyết Minh</Header>
          <AddVideoSteps activeStep={activeStep} />
          <Segment>
            <Error error={errorCreateAudio} />
            <Error error={errorCreateVideo} />
            <Error error={{ message: error }} />
            <Form
              loading={loadingCreateAudio || loadingCreateVideo}
              size="big"
              onSubmit={async e => onFormSubmit(e, createAudio, createVideo)}
            >
              {activeStep === 'video' ? (
                <VideoForm
                  setAddVideoState={setAddVideoState}
                  language={language}
                  source={source}
                  youtubeId={youtubeId}
                  videoValid={videoValid}
                  // language
                  // originTags
                  // youtubeId
                  // videoValid
                  // activeStep
                />
              ) : activeStep === 'audio' ? (
                <AudioForm
                  setAddVideoState={setAddVideoState}
                  isAudioSource={isAudioSource}
                  audioUrl={audioUrl}
                  secureUrl={secureUrl}
                  deleteToken={deleteToken}
                  language={language}
                  source={source}
                  onDeleteFileSubmit={onDeleteFileSubmit}
                  youtubeId={youtubeId}
                  // deleteToken
                  // secureUrl
                  // deleteToken
                  // isAudioSource
                  // activeStep
                  // audioUrl
                />
              ) : (
                <DetailsForm
                  setAddVideoState={setAddVideoState}
                  title={title}
                  description={description}
                  tags={tags}
                  originTags={originTags}
                  // activeStep
                  // tags
                  // description
                  // title
                />
              )}
            </Form>
          </Segment>
        </AddVideoStyles>
      )}
    </Composed>
  );
};

export default AddVideo;
export { createAudioMutation, createVideoMutation };
