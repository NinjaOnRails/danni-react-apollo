import { useState } from 'react';
import axios from 'axios';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Head from 'next/head';
import {
  Loader,
  Container,
  Dropdown,
  Segment,
  Message,
  Button,
} from 'semantic-ui-react';
import { flagOptions } from '../../lib/supportedLanguages';
import DropDownForm from '../styles/VideoFormStyles';
// import CloudinaryUploadAudio from './CloudinaryUploadAudio';
import CloudinaryUploadAudio from './AudioForm';
import Form from '../styles/OldFormStyles';
import Error from '../UI/ErrorMessage';
import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';
import youtube from '../../lib/youtube';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { uploadAudio } from '../../lib/cloudinaryUpload';
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
  // const [redirecting, setRedirecting] = useState(false);
  // const [isDescription, setIsDescription] = useState(true);
  // const [isAudioSource, setIsAudioSource] = useState(false);
  // const [isTags, setIsTags] = useState(true);
  // const [isDefaultVolume, setIsDefaultVolume] = useState(true);
  // const [fetchingYoutube, setFetchingYoutube] = useState(false);
  // const [youtubeIdStatus, setYoutubeIdStatus] = useState('');
  // const [youtubeId, setYoutubeId] = useState('');
  // const [secureUrl, setSecureUrl] = useState('');
  // // const [uploadProgress, setUploadProgress] = useState(0);
  // // const [uploadError, setUploadError] = useState(false);
  // const [deleteToken, setDeleteToken] = useState('');
  // // const [error, setError] = useState('');
  // const [audioDuration, setAudioDuration] = useState(0);
  // const [showUpload, setShowUpload] = useState(false);

  const [editVideoForm, setEditVideoForm] = useState({
    redirecting: false,
    isDescription: true,
    isAudioSource: false,
    isTags: true,
    isDefaultVolume: true,
    fetchingYoutube: false,
    youtubeIdStatus: '',
    youtubeId: '',
    secureUrl: '',
    deleteToken: '',
    audioDuration: 0,
    showUpload: false,
  });

  const [inputState, setInputState] = useState({
    language: null,
    audioUrl: null,
    source: null,
    title: null,
    description: null,
    tags: null,
    defaultVolume: 30,
  });

  const [originInfo, setOriginInfo] = useState({
    originTags: null,
    originTitle: null,
    channelTitle: null,
    image: null,
  });

  const { currentUser } = useCurrentUserQuery();
  const { contentLanguage } = useLocalStateQuery();

  const {
    data,
    loading: loadingQueryVideo,
    error: errorQueryVideo,
  } = useVideoQuery({ id, audioId });

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

  const {
    redirecting,
    isDescription,
    isAudioSource,
    isTags,
    isDefaultVolume,
    fetchingYoutube,
    youtubeIdStatus,
    youtubeId,
    secureUrl,
    deleteToken,
    audioDuration,
    showUpload,
  } = editVideoForm;

  if (redirecting)
    return (
      <Loader indeterminate active>
        Đang chuyển trang...
      </Loader>
    );
  if (errorQueryVideo) return <p>Error</p>;
  if (loadingQueryVideo) return <Loader active />;
  if (!data.video) return <p>No Video Found for {id}</p>;
  const {
    oldTitleVi,
    oldDescriptionVi,
    oldDefaultVolume,
    oldOriginId,
    oldTags,
    oldAudioSource,
    oldLanguage,
    oldImage,
    oldOriginTitle,
    oldOriginChannel,
    oldOriginTags,
  } = getDefaultValues(data, audioId);

  const {
    language,
    audioUrl,
    source,
    title,
    description,
    tags,
    defaultVolume,
  } = inputState;

  const { originTags, originTitle, image, channelTitle } = originInfo;

  const setEditVideoState = newState =>
    setEditVideoForm(prevState => ({ ...prevState, ...newState }));

  const resetUpload = () => {
    setEditVideoState({ deleteToken: '', secureUrl: '' });
    // setUploadProgress(0);
    // setDeleteToken('');
    // setSecureUrl();
  };

  const clearOriginVideoInfo = () => {
    setOriginInfo({
      image: '',
      originTitle: '',
      channelTitle: '',
      originTags: '',
    });
  };

  const fetchYoutube = async originId => {
    // Fetch data from Youtube for info preview
    try {
      setEditVideoState({ fetchingYoutube: true });
      // setFetchingYoutube(true);

      const res = await youtube.get('/videos', {
        params: {
          id: originId,
          part: 'snippet',
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      if (!res.data.items.length) {
        setEditVideoState({
          youtubeIdStatus: 'Not found on Youtube',
          fetchingYoutube: false,
        });
        // setYoutubeIdStatus('Not found on Youtube');
        // setFetchingYoutube(false);
        clearOriginVideoInfo();

        throw new Error('Video not found on Youtube');
      }

      // Destructure response
      const {
        thumbnails: {
          medium: { url },
        },
        fetchedChannelTitle,
        localized: { fetchedTitle },
        tags: fetchedOriginTags,
      } = res.data.items[0].snippet;
      setEditVideoState({
        youtubeIdStatus: '',
        youtubeId: originId,
        fetchingYoutube: false,
      });
      // setYoutubeIdStatus('');
      // setYoutubeId(originId);
      // setFetchingYoutube(false);
      setOriginInfo({
        image: url,
        originTitle: fetchedTitle,
        channelTitle: fetchedChannelTitle,
        originTags: fetchedOriginTags,
      });
    } catch (err) {
      setEditVideoState({ fetchingYoutube: false, youtubeIdStatus: false });
      // setFetchingYoutube(false);
      // setYoutubeIdStatus(false);
      clearOriginVideoInfo();
    }
  };

  const onSourceFill = inputSource => {
    // Check if source is YouTube, extract ID from it and fetch data
    const isYouTube = isYouTubeSource(inputSource);
    let originId;
    if (isYouTube) {
      const { length } = isYouTube;
      originId = inputSource.slice(length, length + youtubeIdLength);
    } else if (inputSource.length === youtubeIdLength) {
      originId = inputSource;
    } else {
      setEditVideoState({ youtubeIdStatus: 'Invalid source' });
      // setYoutubeIdStatus('Invalid source');
      clearOriginVideoInfo();

      throw new Error('No valid YouTube source was provided');
    }
    fetchYoutube(originId);
  };

  const handleChange = ({ target: { name, type, value, checked } }) => {
    // Controlled logic
    const val =
      type === 'checkbox'
        ? checked
        : name === 'defaultVolume' && value > 100
        ? 100
        : type === 'number'
        ? parseInt(value, 10)
        : value;

    // Check video source input to refetch preview if necessary

    if (name === 'source' && val.length >= 11) onSourceFill(val.trim());
    // Controlled set state
    setInputState({ ...inputState, [name]: val });
  };

  const onDeleteFileSubmit = async () => {
    resetUpload();

    const res = await deleteFile(deleteToken);
    if (res.status === 200) {
      setEditVideoState({ deleteToken: '' });
      // setDeleteToken('');
    }
  };

  // const onUploadFileSubmit = async (cloudinaryAuth, e) => {
  //   // Reset uploadError display and assign appropriate value to file
  //   setUploadError(false);
  //   setError('');

  //   const file = e ? e.target.files[0] : audioSource;
  //   if (!file) return; // Do nothing if no file selected

  //   if (deleteToken) await onDeleteFileSubmit();

  //   // More initial state reset
  //   resetUpload();

  //   // Prepare cloudinary upload params
  //   const { url, data: uploadAudioData } = uploadAudio(
  //     file,
  //     youtubeId || oldOriginId,
  //     language || oldLanguage,
  //     id,
  //     cloudinaryAuth
  //   );
  //   // Upload file with post request

  //   try {
  //     const {
  //       data: { secure_url: fetchedSecureUrl, delete_token: newDeleteToken },
  //     } = await axios({
  //       method: 'post',
  //       url,
  //       data: uploadAudioData,
  //       onUploadProgress: p => {
  //         // Show upload progress
  //         setUploadProgress(Math.floor((p.loaded / p.total) * 100));
  //       },
  //     });
  //     setDeleteToken(newDeleteToken);
  //     setSecureUrl(fetchedSecureUrl);

  //     // setAudioSource
  //   } catch (err) {
  //     setUploadError(true);
  //   }
  // };

  const onAudioLoadedMetadata = e => {
    setEditVideoState({ audioDuration: Math.round(e.target.duration) });
    // setAudioDuration(Math.round(e.target.duration));
  };

  const onSubmit = async e => {
    // Stop form from submitting
    e.preventDefault();
    let action = 'no action';
    // if fields unchanged, use default values
    let redirectAudioParam;
    // Call updateVideo mutation
    if (
      (!audioId && !audioUrl && (language || source)) ||
      (audioId && source)
    ) {
      action = 'updateVideo';
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
      (!oldAudioSource || oldAudioSource !== audioUrl)
    ) {
      action = 'createAudio';
      ({
        data: {
          createAudio: { id: redirectAudioParam },
        },
      } = await createAudio({
        variables: {
          source: secureUrl || audioUrl || oldAudioSource,
          // source: audioSource || oldAudioSource,
          language: language || oldLanguage,
          title: title || oldTitleVi,
          description: isDescription
            ? description || oldDescriptionVi
            : undefined,
          tags: isTags ? tags || oldTags : undefined,
          duration: audioDuration,
          defaultVolume: isDefaultVolume
            ? defaultVolume || oldDefaultVolume
            : undefined,
          video: id,
        },
      }));
    } else if (audioId) {
      action = 'updateAudio';
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
          defaultVolume,
        },
      }));
    }
    setEditVideoState({ redirecting: true });
    // setRedirecting(true);
    console.log(action);
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
      <Container>
        <Form data-test="form" onSubmit={onSubmit}>
          <Error error={errorCreateAudio} />
          <Error error={errorUpdateVideo} />
          <Error error={errorUpdateAudio} />
          <fieldset
            disabled={
              loadingUpdateVideo || loadingCreateAudio || loadingUpdateAudio
            }
            aria-busy={loadingUpdateVideo}
          >
            Language:
            <DropDownForm>
              <Dropdown
                fluid
                selection
                options={flagOptions}
                onChange={(e, { value }) => {
                  if (language !== value && deleteToken) {
                    onDeleteFileSubmit();
                  }
                  setInputState({ ...inputState, language: value });
                }}
                defaultValue={oldLanguage}
                name="language"
                className="semantic-dropdown"
              />
            </DropDownForm>
            <label htmlFor="source">
              Nguồn (Link hoặc YouTube ID):
              <input
                type="text"
                id="source"
                name="source"
                required
                defaultValue={oldOriginId}
                onChange={handleChange}
              />
            </label>
            {fetchingYoutube && <Loader inline="centered" active />}
            {youtubeIdStatus && <div>{youtubeIdStatus}</div>}
            {(originTitle || oldOriginTitle) && (
              <Segment>
                <p>{originTitle || oldOriginTitle}</p>
                <p>{channelTitle || oldOriginChannel}</p>
                {(image || oldImage) && (
                  <img width="200" src={image || oldImage} alt="thumbnail" />
                )}
              </Segment>
            )}
            {!audioId && (
              <label htmlFor="isAudioSource">
                <input
                  id="isAudioSource"
                  name="isAudioSource"
                  type="checkbox"
                  checked={audioId || isAudioSource}
                  onChange={handleChange}
                />
                Upload Separate Audio File
              </label>
            )}
            {(audioId || isAudioSource) && (
              <>
                {!secureUrl && oldAudioSource && (
                  <>
                    <p>Current Audio:</p>
                    <audio
                      controls
                      src={oldAudioSource}
                      onLoadedMetadata={onAudioLoadedMetadata}
                    >
                      <track kind="captions" />
                    </audio>
                  </>
                )}
                <p>Upload New Audio:</p>

                {(showUpload && (
                  <CloudinaryUploadAudio
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
                  // <CloudinaryUploadAudio
                  //   onUploadFileSubmit={onUploadFileSubmit}
                  //   source={youtubeId || oldOriginId}
                  //   language={language || oldLanguage}
                  //   uploadProgress={uploadProgress}
                  //   uploadError={uploadError}
                  //   deleteToken={deleteToken}
                  //   onDeleteFileSubmit={onDeleteFileSubmit}
                  //   secureUrl={secureUrl}
                  //   handleChange={handleChange}
                  //   audioSource={audioSource}
                  //   onAudioLoadedMetadata={onAudioLoadedMetadata}
                  // />
                )) || (
                  <Message warning>
                    <p>
                      Uploading a new audio file will immediately permanently
                      replace the old one.{' '}
                      <Button
                        onClick={() => setEditVideoState({ showUpload: true })}
                      >
                        Continue
                      </Button>
                    </p>
                  </Message>
                )}
                {(secureUrl || audioUrl || audioId) && (
                  <>
                    <label htmlFor="title">
                      Tiêu đề:
                      <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        maxLength="100"
                        defaultValue={oldTitleVi}
                        onChange={handleChange}
                      />
                    </label>
                    <label htmlFor="description">
                      <input
                        id="description"
                        name="isDescription"
                        type="checkbox"
                        checked={isDescription}
                        onChange={handleChange}
                      />
                      Nội dung:
                    </label>
                    {isDescription && (
                      <label htmlFor="description">
                        <textarea
                          name="description"
                          maxLength="5000"
                          rows="10"
                          defaultValue={oldDescriptionVi}
                          onChange={handleChange}
                        />
                      </label>
                    )}
                    <label htmlFor="tags">
                      <input
                        id="tags"
                        name="isTags"
                        type="checkbox"
                        checked={isTags}
                        onChange={handleChange}
                      />
                      Tags:
                    </label>
                    {isTags && (
                      <>
                        <input
                          type="text"
                          name="tags"
                          maxLength="500"
                          defaultValue={oldTags.trim()}
                          onChange={handleChange}
                        />
                        {originTags && (
                          <Segment>
                            <p>Current YouTube tags:</p>
                            {originTags.join(' ') ||
                              oldOriginTags.reduce(
                                (tagString, tag) => tagString + ' ' + tag.text,
                                ' '
                              )}
                          </Segment>
                        )}
                      </>
                    )}
                    <label htmlFor="defaultVolume">
                      <input
                        id="defaultVolume"
                        name="isDefaultVolume"
                        type="checkbox"
                        checked={isDefaultVolume}
                        onChange={handleChange}
                      />
                      Âm lượng (%):
                    </label>
                    {isDefaultVolume && (
                      <input
                        type="number"
                        name="defaultVolume"
                        min="0"
                        max="100"
                        defaultValue={oldDefaultVolume}
                        onChange={handleChange}
                      />
                    )}
                  </>
                )}
              </>
            )}
            <button type="submit">Save Changes</button>
          </fieldset>
        </Form>
      </Container>
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
