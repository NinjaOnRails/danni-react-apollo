import { useState } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  Loader,
  Form,
  Segment,
  Message,
  Button,
  Icon,
  Header,
} from 'semantic-ui-react';
import EditVideoStyles from '../styles/AddVideoStyles';
import AudioForm from './AudioForm';
import VideoForm from './VideoForm';
import DetailsForm from './DetailsForm';
import Error from '../UI/ErrorMessage';
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

const EditVideo = ({ id, audioId }) => {
  const [editVideoForm, setEditVideoForm] = useState({
    language: null,
    source: null,
    videoValid: true,
    originTags: null,
    youtubeId: '',
    title: null,
    description: null,
    audioUrl: null,
    tags: null,
    isAudioSource: false,
    secureUrl: '',
    deleteToken: '',
    error: '',
    audioDuration: 0,
    redirecting: false,
    showUpload: false,
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
    showUpload,
  } = editVideoForm;

  const {
    data,
    loading: loadingQueryVideo,
    error: errorQueryVideo,
  } = useVideoQuery({ id, audioId });

  const { currentUser } = useCurrentUserQuery();
  const { contentLanguage } = useLocalStateQuery();
  const [
    createAudio,
    { loading: loadingCreateAudio, error: errorCreateAudio },
  ] = useCreateAudioMutation(currentUser.id, contentLanguage);

  const [
    updateAudio,
    { loading: loadingUpdateAudio, error: errorUpdateAudio },
  ] = useUpdateAudioMutation(id);

  const [
    updateVideo,
    { loading: loadingUpdateVideo, error: errorUpdateVideo },
  ] = useUpdateVideoMutation(id);

  if (loadingQueryVideo) return <Loader active />;
  if (!data.video || errorQueryVideo) return <p>Không tìm thấy video {id}</p>;

  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );

  const {
    oldTitleVi,
    oldDescriptionVi,
    oldOriginId,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldOriginTags,
  } = getDefaultValues(data, audioId);

  const setEditVideoState = newState =>
    setEditVideoForm(prevState => ({ ...prevState, ...newState }));

  const onDeleteFileSubmit = async () => {
    setEditVideoState({ error: '', secureUrl: '' });

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setEditVideoState({ deleteToken: '' });
    }
  };

  const onAudioLoadedMetadata = e => {
    setEditVideoState({ audioDuration: Math.round(e.target.duration) });
    // setAudioDuration(Math.round(e.target.duration));
  };

  const onSubmit = async e => {
    // Stop form from submitting
    e.preventDefault();
    setEditVideoState({ error: '' });
    // if fields unchanged, use default values
    let redirectAudioParam;
    // Call updateVideo mutation
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
    if (
      !audioId &&
      (audioUrl || secureUrl) &&
      (!oldAudioSource || oldAudioSource !== (audioUrl || secureUrl))
    ) {
      ({
        data: {
          createAudio: { id: redirectAudioParam },
        },
      } = await createAudio({
        variables: {
          source: secureUrl || audioUrl || oldAudioSource,
          language: language || oldLanguage,
          title: title || oldTitleVi,
          description: description || oldDescriptionVi,
          tags: tags || oldTags,
          duration: audioDuration,

          video: id,
        },
      }));
    } else if (audioId) {
      ({
        data: {
          updateAudio: { id: redirectAudioParam },
        },
      } = await updateAudio({
        variables: {
          language,
          id: audioId,
          source: secureUrl || oldAudioSource,
          duration: audioDuration,
          title,
          description,
          tags,
        },
      }));
    }
    setEditVideoState({ redirecting: true });
    // Redirect to newly updated Video watch page
    Router.push({
      pathname: '/watch',
      query: { id, audioId: redirectAudioParam },
    });
  };

  return (
    <>
      <Head>
        <title key="title">
          {audioId ? data.video.audio[0].title : data.video.originTitle} | Danni
          TV - Sửa video
        </title>
        <meta
          key="metaTitle"
          name="title"
          content={`${
            audioId ? data.video.audio[0].title : data.video.originTitle
          } | Danni TV - Sửa video`}
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
                    ? 'Thôi thêm thuyết minh cho video'
                    : 'Thêm thuyết minh cho video'
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
                {!secureUrl && oldAudioSource && (
                  <>
                    <Header as="h3" content="File thuyết minh hiện tại:" />
                    <audio
                      controls
                      src={oldAudioSource}
                      onLoadedMetadata={onAudioLoadedMetadata}
                    >
                      <track kind="captions" />
                    </audio>
                  </>
                )}
                <Header as="h3" content="Tải file thuyết minh mới:" />
                {showUpload || isAudioSource ? (
                  <AudioForm
                    setAddVideoState={setEditVideoState}
                    isAudioSource={isAudioSource}
                    audioUrl={audioUrl || ''}
                    secureUrl={secureUrl}
                    deleteToken={deleteToken}
                    language={language || oldLanguage}
                    onDeleteFileSubmit={onDeleteFileSubmit}
                    youtubeId={youtubeId}
                    editVideo
                  />
                ) : (
                  <Message warning>
                    <p>
                      Tải tệp file mới lên sẽ lập tức xoá vĩnh viễn tệp cũ.
                      <Button
                        content="Tiếp tục"
                        negative
                        onClick={() => setEditVideoState({ showUpload: true })}
                      />
                    </p>
                  </Message>
                )}
                <DetailsForm
                  setAddVideoState={setEditVideoState}
                  title={title || oldTitleVi}
                  description={description || oldDescriptionVi}
                  tags={tags || oldTags}
                  originTags={originTags || oldOriginTags}
                  editVideo
                />
              </>
            )}
            <Button
              disabled={!videoValid}
              type="submit"
              size="big"
              icon
              labelPosition="right"
              primary
            >
              Lưu thay đổi
              <Icon name="check" />
            </Button>
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
