import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import axios from 'axios';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';
import AddVideoForm from './AddVideoForm';
import youtube from '../lib/youtube';
import { languageOptions, defaultLanguage } from '../lib/supportedLanguages';
import isYouTubeSource, { youtubeIdLength } from '../lib/isYouTubeSource';
import uploadFileData from '../lib/cloudinaryUploadFileData';
import deleteFile from '../lib/cloudinaryDeleteFile';

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION($source: String!, $language: String) {
    createVideo(source: $source, language: $language) {
      id
      originId
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
  };

  handleChange = e => {
    const { name, type, value, checked } = e.target;

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
    this.setState({ [name]: val });
  };

  handleDropdown = (e, { value }) => {
    if (
      this.state.language !== languageOptions[value] &&
      this.state.deleteToken
    ) {
      this.onDeleteFileSubmit();
    }
    this.setState({ language: languageOptions[value] });
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

  onUploadFileSubmit = async (cloudinaryAuth, id, { target: { files } }) => {
    // Initial state reset
    this.setState({ uploadError: false });
    if (!files[0]) return; // Do nothing if no file selected
    this.setState({
      uploadProgress: 0,
      deleteToken: '',
      secureUrl: '',
    });

    const { url, data } = uploadFileData(
      files,
      this.state.youtubeId,
      this.state.language,
      id,
      cloudinaryAuth
    );

    // Upload file with post request
    try {
      const {
        data: { secure_url: secureUrl, delete_token: deleteToken },
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
        deleteToken,
      });
    } catch {
      this.setState({
        uploadError: true,
      });
    }
  };

  onDeleteFileSubmit = async () => {
    this.setState({
      uploadProgress: 0,
      secureUrl: '',
    });
    const res = await deleteFile(this.state.deleteToken);
    if (res.status === 200) {
      this.setState({
        deleteToken: '',
      });
    }
  };

  onFormSubmit = async (e, createAudio, createVideo) => {
    const {
      audioSource,
      language,
      tags,
      title,
      description,
      isAudioSource,
      defaultVolume,
      isDefaultVolume,
      secureUrl,
      deleteToken,
    } = this.state;

    // Stop form from submitting
    e.preventDefault();

    // Call createVideo mutation
    const {
      data: {
        createVideo: { id },
      },
    } = await createVideo();

    // Call createAudio mutation
    if ((audioSource || secureUrl) && isAudioSource) {
      if (!secureUrl && deleteToken) {
        this.onDeleteFileSubmit();
      }
      const {
        data: {
          createAudio: { id: audioId },
        },
      } = await createAudio({
        variables: {
          source: secureUrl || audioSource,
          language,
          title,
          description,
          tags,
          defaultVolume: isDefaultVolume ? defaultVolume : undefined,
          video: id,
        },
      });
      // Redirect to newly created Video watch page
      Router.push({
        pathname: '/watch',
        query: { id, audioId },
      });

      mixpanel.track('New Video', {
        'Audio Language': language,
      });
    } else {
      if (deleteToken) this.onDeleteFileSubmit();
      Router.push({
        pathname: '/watch',
        query: { id },
      });

      mixpanel.track('New Video', {
        'Audio Language': 'no-audio',
      });
    }
  };

  render() {
    const { source, language, isAudioSource } = this.state;
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
              <>
                <Form
                  data-test="form"
                  onSubmit={async e =>
                    this.onFormSubmit(e, createAudio, createVideo)
                  }
                >
                  <Error error={errorCreateAudio} />
                  <Error error={errorCreateVideo} />
                  <AddVideoForm
                    {...this.state}
                    loadingCreateAudio={loadingCreateAudio}
                    loadingCreateVideo={loadingCreateVideo}
                    handleDropdown={this.handleDropdown}
                    handleChange={this.handleChange}
                    onUploadFileSubmit={this.onUploadFileSubmit}
                    onDeleteFileSubmit={this.onDeleteFileSubmit}
                  />
                </Form>
              </>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default AddVideo;
export { CREATE_AUDIO_MUTATION, CREATE_VIDEO_MUTATION };
