import { useState } from 'react';
import { useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import {
  Loader,
  Form,
  Segment,
  Message,
  Button,
  Icon,
  Header,
} from 'semantic-ui-react';
import Head from 'next/head';
import Error from '../UI/ErrorMessage';
import EditVideoStyles from '../styles/AddVideoStyles';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import {
  useVideoQuery,
  useCreateAudioMutation,
  useUpdateAudioMutation,
  useUpdateVideoMutation,
} from './videoHooks';
import {
  useCurrentUserQuery,
  useLocalStateQuery,
} from '../Authentication/authHooks';
import { getDefaultValues } from './utils';
import AudioForm from './AudioForm';
import VideoForm from './VideoForm';
import DetailsForm from './DetailsForm';

const EditVideo = ({ id, audioId }) => {
  const [editVideoForm, setEditVideoForm] = useState({
    language: '',
    source: '',
    videoValid: true,
    originTags: [],
    youtubeId: '',
    title: '',
    description: '',
    audioUrl: '',
    tags: '',
    isAudioSource: false,
    secureUrl: '',
    deleteToken: '',
    error: null,
    audioDuration: null,
    redirecting: false,
    cusThumbnailSecUrl: '',
    cusThumbnailDelToken: '',
    showUpload: false,
    showUploadThumbnail: false,
  });

  const {
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
    showUpload,
    showUploadThumbnail,
  } = editVideoForm;

  const {
    data,
    loading: loadingQueryVideo,
    error: errorQueryVideo,
  } = useVideoQuery({ id, audioId });

  const router = useRouter();
  const client = useApolloClient();
  const { currentUser } = useCurrentUserQuery();
  const { contentLanguage, previousPage } = useLocalStateQuery();
  const [
    createAudio,
    { loading: loadingCreateAudio, error: errorCreateAudio },
  ] = useCreateAudioMutation(currentUser.id, contentLanguage);
  // Passing videoId for refetchQueries
  const [
    updateAudio,
    { loading: loadingUpdateAudio, error: errorUpdateAudio },
  ] = useUpdateAudioMutation(id);

  const [
    updateVideo,
    { loading: loadingUpdateVideo, error: errorUpdateVideo },
  ] = useUpdateVideoMutation(id);

  if (errorQueryVideo) return <p>Error</p>;
  if (loadingQueryVideo) return <Loader active />;
  if (!data.video) return <p>No Video Found for {id}</p>;
  if (redirecting)
    return (
      <Loader indeterminate active>
        Redirecting...
      </Loader>
    );

  const {
    oldOriginId,
    oldTitleVi,
    oldDescriptionVi,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldCusThumbnail,
  } = getDefaultValues(data, audioId);

  const setEditVideoState = newState =>
    setEditVideoForm(prevState => ({ ...prevState, ...newState }));

  const onDeleteFileSubmit = async () => {
    setEditVideoState({
      uploadProgress: 0,
      secureUrl: '',
      error: '',
    });
    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setEditVideoState({
        deleteToken: '',
      });
    }
  };

  const onCancelClick = () => {
    router.push(localStorage.getItem('previousPage') || previousPage || '/');
    localStorage.removeItem('previousPage');
    client.writeData({ data: { previousPage: null } });
  };

  const onSubmit = async e => {
    e.preventDefault();
    let redirectAudioParam;
    // Update video when
    // Video has no audio, no audio file/url added and either language or source must be changed
    // Video has audio, but changed source
    if (
      (!audioId && !audioUrl && !secureUrl && (language || source)) ||
      (audioId && source)
    ) {
      await updateVideo({
        variables: {
          id,
          source,
          language,
        },
      });
      redirectAudioParam = audioId;
    }
    // Create new audio when
    // No current or previous audio and new audio file/url added or new audio is different to previous audio
    if (
      !audioId &&
      (audioUrl || secureUrl) &&
      (!oldAudioSource ||
        oldAudioSource !== audioUrl ||
        oldAudioSource !== secureUrl)
    ) {
      ({
        data: {
          createAudio: { id: redirectAudioParam },
        },
      } = await createAudio({
        variables: {
          video: id,
          source: secureUrl || audioUrl,
          language: language || oldLanguage,
          // title,
          // description,
          // tags,
          title: title || oldTitleVi,
          description: description || oldDescriptionVi,
          tags: tags || oldTags,
          duration: audioDuration,
        },
      }));
    } else if (audioId) {
      const variables = {
        language,
        source: secureUrl || audioUrl,
        duration: audioDuration,
        title,
        description,
        tags,
        customThumbnail: cusThumbnailSecUrl,
      };
      // Remove null fields to avoid backend error
      Object.keys(variables).forEach(
        key =>
          (variables[key] === '' || variables[key] === null) &&
          delete variables[key]
      );
      ({
        data: {
          updateAudio: { id: redirectAudioParam },
        },
      } = await updateAudio({
        variables: {
          id: audioId,
          ...variables,
        },
      }));
    }

    setEditVideoState({ redirecting: true });

    // Redirect to newly updated Video watch page
    router.push({
      pathname: '/watch',
      query: { id, audioId: redirectAudioParam },
    });
  };
  return (
    <>
      <Head>
        <title key="title">
          {audioId ? data.video.audio[0].title : data.video.originTitle} | Danni
          TV - Update video/dubbing
        </title>
        <meta
          key="metaTitle"
          name="title"
          content={`${
            audioId ? data.video.audio[0].title : data.video.originTitle
          } | Danni TV - Update video`}
        />
      </Head>
      <EditVideoStyles editVideo>
        <Segment>
          <Error error={errorCreateAudio} />
          <Error error={errorUpdateVideo} />
          <Error error={errorUpdateAudio} />
          <Error error={{ message: error }} />
          <Form
            onSubmit={onSubmit}
            size="big"
            loading={
              loadingUpdateVideo || loadingCreateAudio || loadingUpdateAudio
            }
          >
            <VideoForm
              setAddVideoState={setEditVideoState}
              language={language || oldLanguage}
              source={source || oldOriginId}
              youtubeId={youtubeId}
              videoValid={videoValid}
              editVideo
            />
            {!audioId && (
              <Button
                content={
                  isAudioSource
                    ? 'Cancel current audio/dubbing file'
                    : 'Add audio/dubbing'
                }
                className="add-audio-button"
                color={isAudioSource ? 'red' : 'green'}
                onClick={e => {
                  e.preventDefault();
                  setEditVideoState({ isAudioSource: !isAudioSource });
                }}
              />
            )}
            {(audioId || isAudioSource) && (
              <>
                {!secureUrl && !audioUrl && oldAudioSource && (
                  <>
                    <Header as="h3" content="Current audio file:" />
                    <audio controls src={oldAudioSource}>
                      <track kind="captions" />
                    </audio>
                  </>
                )}
                <Header as="h3" content="Upload a new audio file:" />
                {showUpload || isAudioSource ? (
                  <AudioForm
                    setAddVideoState={setEditVideoState}
                    isAudioSource={isAudioSource}
                    audioUrl={audioUrl}
                    secureUrl={secureUrl}
                    deleteToken={deleteToken}
                    language={language || oldLanguage}
                    source={source || oldAudioSource}
                    onDeleteFileSubmit={onDeleteFileSubmit}
                    youtubeId={youtubeId}
                    editVideo
                  />
                ) : (
                  <Message warning visible>
                    <p>
                      Uploading a new file will immediately permanently delete
                      the current file.
                      <Button
                        content="Continue"
                        negative
                        onClick={() => setEditVideoState({ showUpload: true })}
                      />
                    </p>
                  </Message>
                )}
                <DetailsForm
                  setAddVideoState={setEditVideoState}
                  title={title || oldTitleVi}
                  description={description || oldDescriptionVi || ''}
                  tags={tags || oldTags}
                  originTags={originTags}
                  youtubeId={youtubeId || oldOriginId}
                  language={language || oldLanguage}
                  cusThumbnailSecUrl={cusThumbnailSecUrl}
                  oldCusThumbnail={oldCusThumbnail}
                  showUploadThumbnail={showUploadThumbnail}
                  editVideo
                />
              </>
            )}
            <div className="buttons">
              <Button
                type="button"
                size="big"
                icon
                labelPosition="right"
                onClick={onCancelClick}
              >
                Cancel
                <Icon name="cancel" />
              </Button>
              <Button
                disabled={
                  !videoValid || (isAudioSource && !secureUrl && !audioUrl)
                }
                type="submit"
                size="big"
                icon
                labelPosition="right"
                primary
              >
                Save changes
                <Icon name="check" />
              </Button>
            </div>
          </Form>
        </Segment>
      </EditVideoStyles>
    </>
  );
};

EditVideo.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

EditVideo.defaultProps = {
  audioId: null,
};

export default EditVideo;
