import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router, { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Loader, Container } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import axios from 'axios';
import Form from '../styles/OldFormStyles';
import Error from '../UI/ErrorMessage';
import { VIDEO_QUERY, ALL_VIDEOS_QUERY } from '../../graphql/query';
import {
  UPDATE_AUDIO_MUTATION,
  VIDEO_DELETE,
  UPDATE_VIDEO_MUTATION,
} from '../../graphql/mutation';
import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';
import youtube from '../../lib/youtube';
import { createAudioMutation } from './AddVideo';
import EditVideoForm from './EditVideoForm';
import deleteFile from '../../lib/cloudinaryDeleteFile';
import { uploadAudio } from '../../lib/cloudinaryUpload';

/* eslint-disable */
const videoQuery = ({ render, id, audioId }) => (
  <Query query={VIDEO_QUERY} variables={{ id, audioId }}>
    {render}
  </Query>
);

const updateAudioMutation = ({ render, id }) => (
  <Mutation
    mutation={UPDATE_AUDIO_MUTATION}
    refetchQueries={[{ query: VIDEO_QUERY, variables: { id } }]}
  >
    {(updateAudio, updateAudioResult) =>
      render({ updateAudio, updateAudioResult })
    }
  </Mutation>
);

const updateVideoMutation = ({ render, id }) => (
  <Mutation
    mutation={UPDATE_VIDEO_MUTATION}
    refetchQueries={[{ query: VIDEO_QUERY, variables: { id } }]}
  >
    {(updateVideo, updateVideoResult) =>
      render({ updateVideo, updateVideoResult })
    }
  </Mutation>
);

const deleteVideoMutation = ({ render }) => (
  <Mutation
    mutation={VIDEO_DELETE}
    refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
  >
    {(deleteVideo, deleteVideoResult) =>
      render({ deleteVideo, deleteVideoResult })
    }
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  videoQuery,
  createAudioMutation,
  updateAudioMutation,
  updateVideoMutation,
  deleteVideoMutation,
});

class EditVideo extends Component {
  state = {
    isDescription: true,
    isAudioSource: true,
    isTags: true,
    isDefaultVolume: true,
    fetchingYoutube: false,
    youtubeIdStatus: '',
    youtubeId: '',
    secureUrl: '',
    uploadProgress: 0,
    uploadError: false,
    deleteToken: '',
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
    this.setState({ [name]: val });
  };

  handleDropdown = (e, { value }) => {
    const { language, deleteToken } = this.state;
    if (language !== value && deleteToken) {
      this.onDeleteFileSubmit();
    }
    this.setState({ language: value });
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

  onUploadFileSubmit = async (cloudinaryAuth, id, e, defaultValues) => {
    // Reset uploadError display and assign appropriate value to file
    this.setState({ uploadError: false, error: '' });
    const { audioSource, youtubeId, language, deleteToken } = this.state;
    const file = e ? e.target.files[0] : audioSource;
    const { oldOriginId, oldLanguage } = defaultValues;
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
      youtubeId || oldOriginId,
      language || oldLanguage,
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
    } catch (err) {
      console.log(err);
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

  getDefaultValues = data => {
    const {
      router: {
        query: { audioId },
      },
    } = this.props;
    const {
      video: {
        originId: oldOriginId,
        originThumbnailUrl: oldImage,
        originTitle: oldOriginTitle,
        originAuthor: oldOriginChannel,
        originTags: oldOriginTags,
      },
    } = data;
    let oldTitleVi;
    let oldDescriptionVi;
    let oldDefaultVolume = 30;
    let oldTagsObj;
    let oldAudioSource = '';
    let oldAuthor;
    let oldLanguage;
    if (!audioId) {
      ({
        video: {
          originTitle: oldTitleVi,
          originDescription: oldDescriptionVi,
          originTags: oldTagsObj,
          addedBy: { displayName: oldAuthor },
          language: oldLanguage,
        },
      } = data);
    } else {
      const {
        video: { audio },
      } = data;
      // Destructor audio array
      [
        {
          source: oldAudioSource,
          title: oldTitleVi,
          description: oldDescriptionVi,
          tags: oldTagsObj,
          defaultVolume: oldDefaultVolume,
          author: { displayName: oldAuthor },
          language: oldLanguage,
        },
      ] = audio.filter(audioFile => audioFile.id === audioId);
    }
    let oldTags = '';
    Object.values(oldTagsObj).forEach(val => {
      oldTags = oldTags + val.text + ' ';
    });
    return {
      oldOriginId,
      oldTitleVi,
      oldDescriptionVi,
      oldDefaultVolume,
      oldTags,
      oldAudioSource,
      oldAuthor,
      oldLanguage,
      oldImage,
      oldOriginTitle,
      oldOriginChannel,
      oldOriginTags,
    };
  };

  onSubmit = async (
    e,
    updateVideo,
    createAudio,
    updateAudio,
    oldValuesObject
  ) => {
    // Stop form from submitting
    e.preventDefault();
    const {
      router: {
        query: { id, audioId },
      },
    } = this.props;
    const {
      source,
      title,
      description,
      tags,
      defaultVolume,
      language,
      audioDuration,
      isTags,
      isDescription,
      isDefaultVolume,
      audioSource,
      secureUrl,
      image,
    } = this.state;
    // if fields unchanged, use default values
    const {
      oldTitleVi,
      oldDescriptionVi,
      oldDefaultVolume,
      oldTags,
      oldAudioSource,
      oldLanguage,
    } = oldValuesObject;
    let redirectAudioParam;
    // Call createAudio mutation
    if (
      (!audioId && !audioSource && (language || source)) ||
      (audioId && source)
    ) {
      await updateVideo({
        variables: {
          id,
          source,
          language,
          originThumbnailUrl: image,
          originThumbnailUrlSd: image,
        },
      });
      redirectAudioParam = audioId;
    }
    if (
      !audioId &&
      (audioSource || secureUrl) &&
      (!oldAudioSource || oldAudioSource !== audioSource)
    ) {
      ({
        data: {
          createAudio: { id: redirectAudioParam },
        },
      } = await createAudio({
        variables: {
          source: secureUrl || oldAudioSource,
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
      ({
        data: {
          updateAudio: { id: redirectAudioParam },
        },
      } = await updateAudio({
        variables: {
          language,
          id: audioId,
          // source: audioSource,
          source: secureUrl || oldAudioSource,
          duration: audioDuration,
          title,
          description,
          tags,
          defaultVolume,
        },
      }));
    }

    // Redirect to newly updated Video watch page
    Router.push({
      pathname: '/watch',
      query: { id, audioId: redirectAudioParam },
    });
  };

  render() {
    const {
      router: {
        query: { id, audioId },
      },
    } = this.props;
    return (
      <Composed id={id} audioId={audioId}>
        {({
          videoQuery: {
            data,
            loading: loadingQueryVideo,
            error: errorQueryVideo,
          },
          createAudioMutation: {
            createAudio,
            createAudioResult: {
              loading: loadingCreateAudio,
              error: errorCreateAudio,
            },
          },
          updateAudioMutation: {
            updateAudio,
            updateAudioResult: {
              loading: loadingUpdateAudio,
              error: errorUpdateAudio,
            },
          },
          updateVideoMutation: {
            updateVideo,
            updateVideoResult: {
              loading: loadingUpdateVideo,
              error: errorUpdateVideo,
            },
          },
          // deleteVideoMutation: {
          //   deleteVideo,
          //   deleteVideoResult: {
          //     loading: loadingDeleteVideo,
          //     error: errorDeleteVideo,
          //   },
          // },
        }) => {
          if (errorQueryVideo) return <p>Error</p>;
          if (loadingQueryVideo) return <Loader active />;
          if (!data.video) return <p>No Video Found for {id}</p>;
          const oldValuesObject = this.getDefaultValues(data);
          return (
            <Container>
              <Form
                data-test="form"
                onSubmit={e =>
                  this.onSubmit(
                    e,
                    updateVideo,
                    createAudio,
                    updateAudio,
                    oldValuesObject
                  )
                }
              >
                <Error error={errorCreateAudio} />
                <Error error={errorUpdateVideo} />
                <Error error={errorUpdateAudio} />
                <EditVideoForm
                  {...this.state}
                  {...oldValuesObject}
                  loadingUpdateVideo={loadingUpdateVideo}
                  loadingCreateAudio={loadingCreateAudio}
                  loadingUpdateAudio={loadingUpdateAudio}
                  handleChange={this.handleChange}
                  handleDropdown={this.handleDropdown}
                  onUploadFileSubmit={(cloudinaryAuth, id, e) =>
                    this.onUploadFileSubmit(
                      cloudinaryAuth,
                      id,
                      e,
                      oldValuesObject
                    )
                  }
                  onDeleteFileSubmit={this.onDeleteFileSubmit}
                  onAudioLoadedMetadata={this.onAudioLoadedMetadata}
                />
              </Form>
            </Container>
          );
        }}
      </Composed>
    );
  }
}

EditVideo.propTypes = {
  router: PropTypes.object.isRequired,
};

export default withRouter(EditVideo);
