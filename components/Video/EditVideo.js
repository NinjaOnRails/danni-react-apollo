import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router, { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Loader, Container } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
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
    image: '',
    originTitle: '',
    channelTitle: '',
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

  getDefaultValues = data => {
    const {
      router: {
        query: { audioId },
      },
    } = this.props;
    const {
      video: { originId: oldOriginId },
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
      ] = audio;
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
    };
  };

  onSubmit = async (e, updateVideo, data, createAudio, updateAudio) => {
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
      isTags,
      isDescription,
      isDefaultVolume,
      audioSource,
      audioLanguage,
    } = this.state;

    // Call createAudio mutation
    if (source) {
      await updateVideo({
        variables: {
          id,
          source,
          language: audioLanguage,
        },
      });
    }

    if (audioId) {
      await updateAudio({
        variables: {
          language: audioLanguage,
          id: audioId,
          source: audioSource,
          // source: secureUrl,
          // duration: audioDuration,
          title,
          description: isDescription ? description : undefined,
          tags: isTags ? tags : undefined,
          defaultVolume: isDefaultVolume ? defaultVolume : undefined,
        },
      });
    }
    if (
      !audioId &&
      audioSource &&
      (!data.video.audio[0] || data.video.audio[0].source !== audioSource)
    ) {
      await createAudio({
        variables: {
          // source: secureUrl,
          source: audioSource,
          language: audioLanguage,
          title,
          description: isDescription ? description : undefined,
          tags: isTags ? tags : undefined,
          duration: 0,
          defaultVolume: isDefaultVolume ? defaultVolume : undefined,
          video: id,
        },
      });
    }
    // Redirect to newly updated Video watch page
    Router.push({
      pathname: '/watch',
      query: { id, audioId },
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
          const {
            oldOriginId,
            oldTitleVi,
            oldDescriptionVi,
            oldDefaultVolume,
            oldTags,
            oldAudioSource,
            oldAuthor,
            oldLanguage,
          } = this.getDefaultValues(data);
          return (
            <Container>
              <Form
                data-test="form"
                onSubmit={e =>
                  this.onSubmit(e, updateVideo, data, createAudio, updateAudio)
                }
              >
                <Error error={errorCreateAudio} />
                <Error error={errorUpdateVideo} />
                <Error error={errorUpdateAudio} />
                <EditVideoForm
                  {...this.state}
                  oldTitleVi={oldTitleVi}
                  oldDescriptionVi={oldDescriptionVi}
                  oldDefaultVolume={oldDefaultVolume}
                  oldOriginId={oldOriginId}
                  oldTags={oldTags}
                  oldAudioSource={oldAudioSource}
                  oldAuthor={oldAuthor}
                  oldLanguage={oldLanguage}
                  loadingUpdateVideo={loadingUpdateVideo}
                  loadingCreateAudio={loadingCreateAudio}
                  loadingUpdateAudio={loadingUpdateAudio}
                  handleChange={this.handleChange}
                  handleDropdown={this.handleDropdown}
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
