import React, { useState } from 'react';
import { Segment, Form, Loader } from 'semantic-ui-react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { defaultLanguage } from '../../lib/supportedLanguages';
import Error from '../UI/ErrorMessage';
import VideoForm from './VideoForm';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { trackNewVideo } from '../../lib/mixpanel';
import AddVideoSteps from './AddVideoSteps';
import AudioForm from './AudioForm';
import AddVideoStyles from '../styles/AddVideoStyles';
import DetailsForm from './DetailsForm';
import { useCreateAudioMutation, useCreateVideoMutation } from './videoHooks';
import {
  useCurrentUserQuery,
  useLocalStateQuery,
} from '../Authentication/authHooks';

const AddVideo = () => {
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
    cusThumbnailSecUrl: '',
    cusThumbnailDelToken: '',
  });

  const {
    activeStep,
    language,
    source,
    videoValid,
    originTags,
    youtubeId,
    title,
    description,
    audioUrl,
    tags,
    isAudioSource,
    secureUrl,
    deleteToken,
    error,
    audioDuration,
    redirecting,
    cusThumbnailSecUrl,
    cusThumbnailDelToken,
  } = addVideoForm;

  const { currentUser } = useCurrentUserQuery();
  const { contentLanguage } = useLocalStateQuery();
  const router = useRouter();
  const [
    createAudio,
    { loading: loadingCreateAudio, error: errorCreateAudio },
  ] = useCreateAudioMutation(currentUser.id, contentLanguage);

  const [
    createVideo,
    { loading: loadingCreateVideo, error: errorCreateVideo },
  ] = useCreateVideoMutation(
    youtubeId,
    isAudioSource,
    language,
    currentUser.id,
    contentLanguage
  );

  const setAddVideoState = newState =>
    setAddVideoForm(prevState => ({ ...prevState, ...newState }));

  const onDeleteFileSubmit = async () => {
    setAddVideoState({ secureUrl: '', error: '' });
    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setAddVideoState({ deleteToken: '' });
    }
  };
  const onFormSubmit = async e => {
    // Stop form from submitting
    e.preventDefault();
    setAddVideoState({ error: '' });
    if (isAudioSource && !secureUrl)
      return setAddVideoState({
        error: 'You have not uploaded an audio file yet',
      });

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
          customThumbnail: cusThumbnailSecUrl,
        },
      });

      setAddVideoState({ redirecting: true });

      // Mixpanel send stat
      trackNewVideo(language);

      // Redirect to newly created Video watch page
      return router.push({
        pathname: '/watch',
        query: { id, audioId },
      });
    }
    setAddVideoState({ redirecting: true });
    if (deleteToken) onDeleteFileSubmit();

    // Mixpanel send stat
    trackNewVideo();

    return router.push({
      pathname: '/watch',
      query: { id },
    });
  };

  if (redirecting)
    return (
      <Loader indeterminate active>
        Redirecting...
      </Loader>
    );
  return (
    <>
      <Head>
        <title key="title">Danni TV - Add Video</title>
        <meta key="metaTitle" name="title" content="Danni TV - Add Video" />
      </Head>
      <AddVideoStyles>
        <AddVideoSteps activeStep={activeStep} />
        <Segment>
          <Error error={errorCreateAudio} />
          <Error error={errorCreateVideo} />
          <Error error={{ message: error }} />
          <Form
            loading={loadingCreateAudio || loadingCreateVideo}
            size="big"
            onSubmit={onFormSubmit}
          >
            {activeStep === 'video' ? (
              <VideoForm
                setAddVideoState={setAddVideoState}
                language={language}
                source={source}
                youtubeId={youtubeId}
                videoValid={videoValid}
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
              />
            ) : (
              <DetailsForm
                setAddVideoState={setAddVideoState}
                title={title}
                description={description}
                tags={tags}
                originTags={originTags}
                youtubeId={youtubeId}
                language={language}
              />
            )}
          </Form>
        </Segment>
      </AddVideoStyles>
    </>
  );
};

export default AddVideo;
