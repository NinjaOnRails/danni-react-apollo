import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import Form from '../styles/Form';
import Error from '../ui/ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';
import AddVideoForm from './AddVideoForm';
import youtube from '../../lib/youtube';
import { languageOptions, defaultLanguage } from '../../lib/supportedLanguages';
import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';
import uploadFileData from '../../lib/cloudinaryUploadFileData';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { trackNewVideo } from '../../lib/mixpanel';

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION($source: String!, $language: String) {
    createVideo(source: $source, language: $language) {
      id
      originId
      duration
    }
  }
`;

const CREATE_AUDIO_MUTATION = gql`
  mutation CREATE_AUDIO_MUTATION(
    $source: String!
    $language: Language!
    $title: String!
    $description: String
    $tags: String
    $duration: Int!
    $defaultVolume: Int
    $video: ID!
  ) {
    createAudio(
      data: {
        source: $source
        language: $language
        title: $title
        description: $description
        tags: $tags
        duration: $duration
        defaultVolume: $defaultVolume
        video: $video
      }
    ) {
      id
      source
      language
      title
    }
  }
`;

class AddVideo extends Component {
  state = {
    source: '',
    title: '',
    description: '',
    isDescription: true,
    audioSource: '',
    tags: '',
    isAudioSource: false,
    isTags: true,
    defaultVolume: 20,
    isDefaultVolume: false,
    youtubeIdStatus: '',
    image: '',
    channelTitle: '',
    originTitle: '',
    originTags: [],
    youtubeId: '',
    secureUrl: '',
    language: languageOptions[defaultLanguage],
    uploadProgress: 0,
    uploadError: false,
    deleteToken: '',
    fetchingYoutube: false,
    error: '',
    audioDuration: 0,
  };

  handleChange = ({ target: { name, type, value, checked } }) => {
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
    if (name === 'source' && val.length >= 11) this.onSourceFill(val.trim());

    // Controlled set state
    this.setState({ [name]: val, error: '' });
  };

  handleDropdown = (e, { value }) => {
    const { language, deleteToken } = this.state;
    if (language !== languageOptions[value] && deleteToken) {
      this.onDeleteFileSubmit();
    }
    this.setState({ language: languageOptions[value], error: '' });
  };

  onSourceFill = source => {
    // Check if source is YouTube, extract ID from it and fetch data
    const isYouTube = isYouTubeSource(source);
    let originId;
    if (isYouTube) {
      const { length } = isYouTube;
      originId = source.slice(length, length + youtubeIdLength);
    } else if (source.length === youtubeIdLength) {
      originId = source;
    } else {
      this.setState({
        youtubeIdStatus: 'Invalid source',
        image: '',
        originTitle: '',
        channelTitle: '',
      });
      throw new Error('No valid YouTube source was provided');
    }

    this.fetchYoutube(originId);
  };

  fetchYoutube = async id => {
    // Fetch data from Youtube for info preview
    try {
      this.setState({ fetchingYoutube: true });
      const res = await youtube.get('/videos', {
        params: {
          id,
          part: 'snippet',
          key: process.env.YOUTUBE_API_KEY,
        },
      });

      if (!res.data.items.length) {
        this.setState({
          youtubeIdStatus: 'Not found on Youtube',
          image: '',
          originTitle: '',
          channelTitle: '',
          fetchingYoutube: false,
        });
        throw new Error('Video not found on Youtube');
      }

      // Destructure response
      const {
        thumbnails: {
          medium: { url },
        },
        channelTitle,
        localized: { title },
        tags: originTags,
      } = res.data.items[0].snippet;

      this.setState({
        youtubeIdStatus: '',
        youtubeId: id,
        image: url,
        originTitle: title,
        channelTitle,
        originTags,
        fetchingYoutube: false,
      });
    } catch (err) {
      this.setState({
        youtubeIdStatus: 'Network error',
        image: '',
        originTitle: '',
        channelTitle: '',
        fetchingYoutube: false,
      });
    }
  };

  onUploadFileSubmit = async (cloudinaryAuth, id, e) => {
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
    const { url, data } = uploadFileData(
      file,
      youtubeId,
      language,
      id,
      cloudinaryAuth
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
    } catch {
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
    this.onDeleteFileSubmit();

    // Mixpanel send stat
    trackNewVideo();

    return Router.push({
      pathname: '/watch',
      query: { id },
    });
  };

  render() {
    const { source, language, isAudioSource, error } = this.state;
    return (
      <Mutation
        mutation={CREATE_AUDIO_MUTATION}
        refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
      >
        {(
          createAudio,
          { loading: loadingCreateAudio, error: errorCreateAudio }
        ) => (
          <Mutation
            mutation={CREATE_VIDEO_MUTATION}
            variables={{
              source,
              language: isAudioSource ? null : language,
            }}
            refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
          >
            {(
              createVideo,
              { loading: loadingCreateVideo, error: errorCreateVideo }
            ) => (
              <Container>
                <Form
                  data-test="form"
                  onSubmit={async e =>
                    this.onFormSubmit(e, createAudio, createVideo)
                  }
                >
                  <Error error={errorCreateAudio} />
                  <Error error={errorCreateVideo} />
                  <Error error={{ message: error }} />
                  <AddVideoForm
                    {...this.state}
                    loadingCreateAudio={loadingCreateAudio}
                    loadingCreateVideo={loadingCreateVideo}
                    handleDropdown={this.handleDropdown}
                    handleChange={this.handleChange}
                    onUploadFileSubmit={this.onUploadFileSubmit}
                    onDeleteFileSubmit={this.onDeleteFileSubmit}
                    onAudioLoadedMetadata={this.onAudioLoadedMetadata}
                  />
                </Form>
              </Container>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default AddVideo;
export { CREATE_AUDIO_MUTATION, CREATE_VIDEO_MUTATION };
