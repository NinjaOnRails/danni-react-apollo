import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';
import youtube from '../lib/youtube';

const youtubeIdLength = 11;

const CREATE_VIDEO_MUTATION = gql`
  mutation CREATE_VIDEO_MUTATION(
    $source: String!
    $titleVi: String!
    $descriptionVi: String
    $addedBy: String
    $tags: String
    $defaultVolume: Int
  ) {
    createVideo(
      data: {
        source: $source
        titleVi: $titleVi
        descriptionVi: $descriptionVi
        addedBy: $addedBy
        tags: $tags
        defaultVolume: $defaultVolume
      }
    ) {
      id
      originId
      titleVi
      startAt
    }
  }
`;

const CREATE_AUDIO_MUTATION = gql`
  mutation CREATE_AUDIO_MUTATION($source: String!, $video: ID) {
    createAudio(data: { source: $source, video: $video }) {
      id
      source
      video {
        id
      }
    }
  }
`;

class AddVideo extends Component {
  state = {
    source: '',
    titleVi: '',
    descriptionVi: '',
    isDescriptionVi: true,
    audioSource: '',
    tags: '',
    isAudioSource: true,
    isTags: true,
    defaultVolume: 20,
    isDefaultVolume: true,
    youtubeIdStatus: '',
    image: '',
    channelTitle: '',
    originTitle: '',
    originTags: [],
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
        });
        throw new Error('Video not found on Youtube');
      }

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
      originTags,
    } = this.state;
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
              titleVi,
              descriptionVi,
              tags,
              defaultVolume: isDefaultVolume ? defaultVolume : undefined,
            }}
            refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
          >
            {(
              createVideo,
              { loading: loadingCreateVideo, error: errorCreateVideo }
            ) => (
              <Form
                data-test="form"
                onSubmit={async e => {
                  // Stop form from submitting
                  e.preventDefault();

                  // Call createVideo mutation
                  const {
                    data: {
                      createVideo: { id },
                    },
                  } = await createVideo();

                  // Call createAudio mutation
                  if (audioSource && isAudioSource) {
                    await createAudio({
                      variables: {
                        source: audioSource,
                        video: id,
                      },
                    });
                  }

                  // Redirect to newly created Video watch page
                  Router.push({
                    pathname: '/watch',
                    query: { id },
                  });
                }}
              >
                <Error error={errorCreateAudio} />
                <Error error={errorCreateVideo} />
                <fieldset
                  disabled={loadingCreateVideo || loadingCreateAudio}
                  aria-busy={loadingCreateVideo}
                >
                  <label htmlFor="source">
                    Nguồn (Link hoặc YouTube ID):
                    <input
                      type="text"
                      id="source"
                      name="source"
                      required
                      placeholder="ví dụ '0Y59Yf9lEP0' hoặc 'https://www.youtube.com/watch?v=h4Uu5eyN6VU'"
                      value={source}
                      onChange={this.handleChange}
                    />
                  </label>
                  {youtubeIdStatus && <div>{youtubeIdStatus}</div>}
                  {originTitle && <div>{originTitle}</div>}
                  {channelTitle && <div>{channelTitle}</div>}
                  {image && <img width="200" src={image} alt="thumbnail" />}
                  <label htmlFor="titleVi">
                    Tiêu đề:
                    <input
                      type="text"
                      id="titleVi"
                      name="titleVi"
                      required
                      value={titleVi}
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
                        value={descriptionVi}
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
                      value={defaultVolume}
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
                    <>
                      <div>{originTags.join(' ')}</div>
                      <input
                        type="text"
                        name="tags"
                        placeholder="ví dụ 'thúvị khoahọc vũtrụ thuyếtphục yhọc lịchsử'"
                        value={tags}
                        onChange={this.handleChange}
                      />
                    </>
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
                      value={audioSource}
                      onChange={this.handleChange}
                    />
                  )}
                  <button type="submit">Submit</button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        )}
      </Mutation>
    );
  }
}

export default AddVideo;
export { CREATE_AUDIO_MUTATION };
