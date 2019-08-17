import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Router from 'next/router';
import { Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';
import Form from './styles/Form';
import Error from './ErrorMessage';
import CloudinaryUpload from './CloudinaryUpload';
import { ALL_VIDEOS_QUERY } from './Videos';
import youtube from '../lib/youtube';
import {
  flagOptions,
  languageOptions,
  defaultLanguage,
} from '../lib/supportedLanguages';
import isYouTubeSource, { youtubeIdLength } from '../lib/isYouTubeSource';
import uploadToCloudinary from '../lib/uploadToCloudinary';

const DropdownForm = styled.div`
  .semantic-dropdown.ui.fluid.selection.dropdown {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    margin-bottom: 5px;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }
  .text {
    margin: auto;
  }
`;

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
    isAudioSource: true,
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
    showPlayer: false,
    language: languageOptions[defaultLanguage],
  };

  handleChange = e => {
    const { name, type, value, checked } = e.target;
    const { secureUrl } = this.state;

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

    // Check audio source input to show/hide audio player
    if (name === 'audioSource' && val === secureUrl) {
      this.setState({ showPlayer: true });
    }
    if (name === 'audioSource' && val !== secureUrl) {
      this.setState({ showPlayer: false });
    }

    // Controlled set state
    this.setState({ [name]: val });
  };

  handleDropdown = (e, { value }) => {
    this.setState({ language: languageOptions[value] });
  };

  onSourceFill = async source => {
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

  uploadFile = async (cloudinaryAuth, id, e) => {
    //
    const { secure_url } = await uploadToCloudinary(
      e.target.files,
      this.state.youtubeId,
      id,
      this.state.language,
      cloudinaryAuth
    );

    this.setState({
      audioSource: secure_url,
      secureUrl: secure_url,
      showPlayer: true,
    });
  };

  render() {
    const {
      source,
      audioSource,
      language,
      tags,
      title,
      description,
      isDescription,
      isAudioSource,
      isTags,
      defaultVolume,
      isDefaultVolume,
      image,
      originTitle,
      channelTitle,
      youtubeIdStatus,
      originTags,
      youtubeId,
      showPlayer,
      secureUrl,
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
                      const {
                        data: {
                          createAudio: { id: audioId },
                        },
                      } = await createAudio({
                        variables: {
                          source: audioSource,
                          language,
                          title,
                          description,
                          tags,
                          defaultVolume: isDefaultVolume
                            ? defaultVolume
                            : undefined,
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
                      Router.push({
                        pathname: '/watch',
                        query: { id },
                      });

                      mixpanel.track('New Video', {
                        'Audio Language': 'no-audio',
                      });
                    }
                  }}
                >
                  <Error error={errorCreateAudio} />
                  <Error error={errorCreateVideo} />
                  <fieldset
                    disabled={loadingCreateVideo || loadingCreateAudio}
                    aria-busy={loadingCreateVideo}
                  >
                    Ngôn ngữ:
                    <DropdownForm>
                      <Dropdown
                        fluid
                        selection
                        options={flagOptions}
                        onChange={this.handleDropdown}
                        defaultValue={defaultLanguage}
                        name="language"
                        className="semantic-dropdown"
                      />
                    </DropdownForm>
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
                    {youtubeId && (
                      <>
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
                          <>
                            <CloudinaryUpload
                              uploadFile={this.uploadFile}
                              source={youtubeId}
                              language={language}
                            />
                            <label htmlFor="audioSource">
                              Đường link
                              <input
                                type="text"
                                name="audioSource"
                                placeholder="ví dụ 'https://res.cloudinary.com/danni/video/upload/v1566037102/ENGLISH.mp3'"
                                value={audioSource}
                                onChange={this.handleChange}
                              />
                              {audioSource && secureUrl && showPlayer && (
                                <audio controls src={audioSource} />
                              )}
                            </label>
                            <label htmlFor="title">
                              Tiêu đề:
                              <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={title}
                                onChange={this.handleChange}
                              />
                            </label>
                            <label htmlFor="description">
                              <input
                                id="description"
                                name="isDescription"
                                type="checkbox"
                                checked={isDescription}
                                onChange={this.handleChange}
                              />
                              Nội dung:
                            </label>
                            {isDescription && (
                              <label htmlFor="description">
                                <input
                                  type="text"
                                  name="description"
                                  value={description}
                                  onChange={this.handleChange}
                                />
                              </label>
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
                            <label htmlFor="defaultVolume">
                              <input
                                id="defaultVolume"
                                name="isDefaultVolume"
                                type="checkbox"
                                checked={isDefaultVolume}
                                onChange={this.handleChange}
                              />
                              Âm lượng mặc định cho video gốc (%):
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
                          </>
                        )}
                      </>
                    )}
                    <button type="submit">Submit</button>
                  </fieldset>
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
