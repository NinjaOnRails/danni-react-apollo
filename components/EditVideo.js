import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import Router, { withRouter } from 'next/router';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { VIDEO_QUERY } from './Watch';
import { CREATE_AUDIO_MUTATION } from './AddVideo';
import youtube from '../lib/youtube';

const youtubeIdLength = 11;

const UPDATE_VIDEO_MUTATION = gql`
  mutation UPDATE_VIDEO_MUTATION(
    $id: ID!
    $source: String
    $titleVi: String
    $descriptionVi: String
    $tags: String
    $defaultVolume: Int
    $password: String!
  ) {
    updateVideo(
      id: $id
      password: $password
      data: {
        source: $source
        titleVi: $titleVi
        descriptionVi: $descriptionVi
        tags: $tags
        defaultVolume: $defaultVolume
      }
    ) {
      id
      originId
      titleVi
    }
  }
`;

class EditVideo extends Component {
  state = {
    isDescriptionVi: true,
    isAudioSource: true,
    isTags: true,
    isDefaultVolume: true,
  };

  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  handleChange = e => {
    const { name, type, value, checked } = e.target;
    const val =
      type === 'checkbox'
        ? checked
        : name === 'defaultVolume' && value > 100
        ? 100
        : type === 'number'
        ? parseInt(value, 10)
        : value;

    if (name === 'source' && val.length >= 11) this.onSourceFill(val);

    this.setState({ [name]: val });
  };

  onSourceFill = async source => {
    // Check if source is YouTube and extract ID from it
    const youtubeId = source.trim();
    const sourceYouTube = [
      { domain: 'https://youtube.com/watch?v=', length: 28 },
      { domain: 'http://youtube.com/watch?v=', length: 27 },
      { domain: 'https://www.youtube.com/watch?v=', length: 32 },
      { domain: 'http://www.youtube.com/watch?v=', length: 31 },
      { domain: 'youtube.com/watch?v=', length: 20 },
      { domain: 'www.youtube.com/watch?v=', length: 24 },
      { domain: 'https://youtu.be/', length: 17 },
      { domain: 'https://www.youtu.be/', length: 21 },
      { domain: 'http://youtu.be/', length: 16 },
      { domain: 'http://www.youtu.be/', length: 20 },
      { domain: 'youtu.be/', length: 9 },
      { domain: 'www.youtu.be/', length: 13 },
    ];
    const isYouTube = sourceYouTube.find(value =>
      youtubeId.startsWith(value.domain)
    );
    let originId;
    if (isYouTube) {
      const { length } = isYouTube;
      originId = youtubeId.slice(length, length + youtubeIdLength);
    } else if (youtubeId.length === youtubeIdLength) {
      originId = youtubeId;
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
    // Fetch info from Youtube
    try {
      const res = await youtube.get('/videos', {
        params: {
          id,
        },
      });

      if (!res.data.items.length) {
        this.setState({
          youtubeIdStatus: 'Not found on Youtube',
          image: '',
          originTitle: '',
          channelTitle: '',
        });
        throw new Error('Video not found on Youtube');
      }

      const {
        thumbnails: {
          medium: { url },
        },
        channelTitle,
        localized: { title },
      } = res.data.items[0].snippet;

      this.setState({
        youtubeIdStatus: '',
        image: url,
        originTitle: title,
        channelTitle,
      });
    } catch (err) {
      this.setState({
        youtubeIdStatus: 'Network error',
        image: '',
        originTitle: '',
        channelTitle: '',
      });
    }
  };

  render() {
    const {
      router: {
        query: { id, password },
      },
    } = this.props;
    const {
      source,
      audioSource,
      tags,
      titleVi,
      descriptionVi,
      isDescriptionVi,
      isAudioSource,
      isTags,
      defaultVolume,
      isDefaultVolume,
      image,
      originTitle,
      channelTitle,
      youtubeIdStatus,
    } = this.state;
    return (
      <Query query={VIDEO_QUERY} variables={{ id }}>
        {({ error, loading, data }) => {
          if (error || password !== 'dracarys') return <p>Error</p>;
          if (loading) return <Loader active />;
          if (!data.video) return <p>No Video Found for {id}</p>;
          const {
            video: {
              titleVi: oldTitleVi,
              descriptionVi: oldDescriptionVi,
              defaultVolume: oldDefaultVolume,
              originId: oldOriginId,
              tags: oldTagsObj,
            },
          } = data;

          let oldTags = '';
          Object.values(oldTagsObj).forEach(val => {
            oldTags = oldTags + val.text + ' ';
          });

          return (
            <Mutation
              mutation={CREATE_AUDIO_MUTATION}
              refetchQueries={[{ query: VIDEO_QUERY, variables: { id } }]}
            >
              {(
                createAudio,
                { loading: loadingCreateAudio, error: errorCreateAudio }
              ) => (
                <Mutation
                  mutation={UPDATE_VIDEO_MUTATION}
                  variables={{
                    id,
                    source,
                    titleVi,
                    descriptionVi,
                    tags,
                    defaultVolume,
                    password,
                  }}
                  refetchQueries={[{ query: VIDEO_QUERY, variables: { id } }]}
                >
                  {(
                    updateVideo,
                    { loading: loadingUpdateVideo, error: errorUpdateVideo }
                  ) => (
                    <Form
                      data-test="form"
                      onSubmit={async e => {
                        // Stop form from submitting
                        e.preventDefault();

                        // Call updateVideo mutation
                        const {
                          data: {
                            updateVideo: { id },
                          },
                        } = await updateVideo();

                        // Call createAudio mutation
                        if (
                          audioSource &&
                          isAudioSource &&
                          (!data.video.audio[0] ||
                            data.video.audio[0].source !== audioSource)
                        ) {
                          await createAudio({
                            variables: {
                              source: audioSource,
                              video: id,
                            },
                          });
                        }

                        // Redirect to newly updated Video watch page
                        Router.push({
                          pathname: '/watch',
                          query: { id },
                        });
                      }}
                    >
                      <Error error={errorCreateAudio} />
                      <Error error={errorUpdateVideo} />
                      <fieldset
                        disabled={loadingUpdateVideo || loadingCreateAudio}
                        aria-busy={loadingUpdateVideo}
                      >
                        <label htmlFor="source">
                          Nguồn (Link hoặc YouTube ID):
                          <input
                            type="text"
                            id="source"
                            name="source"
                            required
                            placeholder="ví dụ '0Y59Yf9lEP0' hoặc 'https://www.youtube.com/watch?v=h4Uu5eyN6VU'"
                            defaultValue={oldOriginId}
                            onChange={this.handleChange}
                          />
                        </label>
                        {youtubeIdStatus && <div>{youtubeIdStatus}</div>}
                        {originTitle && <div>{originTitle}</div>}
                        {channelTitle && <div>{channelTitle}</div>}
                        {image && (
                          <img width="200" src={image} alt="thumbnail" />
                        )}
                        <label htmlFor="titleVi">
                          Tiêu đề:
                          <input
                            type="text"
                            id="titleVi"
                            name="titleVi"
                            required
                            placeholder="ví dụ 'Sự sống trên mặt trăng xanh'"
                            defaultValue={oldTitleVi}
                            onChange={this.handleChange}
                          />
                        </label>
                        <label htmlFor="descriptionVi">
                          <input
                            id="descriptionVi"
                            name="isDescriptionVi"
                            type="checkbox"
                            checked={isDescriptionVi}
                            onChange={this.handleChange}
                          />
                          Nội dung:
                        </label>
                        {isDescriptionVi && (
                          <label htmlFor="descriptionVi">
                            <input
                              type="text"
                              name="descriptionVi"
                              defaultValue={oldDescriptionVi}
                              onChange={this.handleChange}
                            />
                          </label>
                        )}
                        <label htmlFor="defaultVolume">
                          <input
                            id="defaultVolume"
                            name="isDefaultVolume"
                            type="checkbox"
                            checked={isDefaultVolume}
                            onChange={this.handleChange}
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
                            onChange={this.handleChange}
                          />
                        )}
                        <label htmlFor="tags">
                          <input
                            id="tags"
                            name="isTags"
                            type="checkbox"
                            checked={isTags}
                            onChange={this.handleChange}
                          />
                          Tags:
                        </label>
                        {isTags && (
                          <input
                            type="text"
                            name="tags"
                            placeholder="ví dụ 'thúvị khoahọc vũtrụ thuyếtphục yhọc lịchsử'"
                            defaultValue={oldTags.trim()}
                            onChange={this.handleChange}
                          />
                        )}
                        <label htmlFor="audioSource">
                          <input
                            id="audioSource"
                            name="isAudioSource"
                            type="checkbox"
                            checked={isAudioSource}
                            onChange={this.handleChange}
                          />
                          Nguồn Audio:
                        </label>
                        {isAudioSource && (
                          <input
                            type="text"
                            name="audioSource"
                            placeholder="ví dụ 'http://k007.kiwi6.com/hotlink/ceru6wup3q/ung_thu_tu_cung_18s.mp3'"
                            defaultValue={
                              data.video.audio.length
                                ? data.video.audio[data.video.audio.length - 1]
                                    .source
                                : ''
                            }
                            onChange={this.handleChange}
                          />
                        )}
                        <button type="submit">Save Changes</button>
                      </fieldset>
                    </Form>
                  )}
                </Mutation>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default withRouter(EditVideo);
