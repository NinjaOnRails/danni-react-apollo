import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import SoundCloudPlayer from 'react-player/lib/players/SoundCloud';
import styled from 'styled-components';
import Error from './ErrorMessage';

const VIDEO_QUERY = gql`
  query VIDEO_QUERY($id: ID!) {
    video(where: { id: $id }) {
      id
      youtubeId
      title
      channelTitle
      thumbnailUrl
      defaultLanguage
      audio {
        id
        source
        language
      }
      createdAt
    }
  }
`;

const SoundCloud = styled.div`
  /* visibility: hidden; */
`;

const interval = 1.02;

class Watch extends Component {
  state = {
    playingSoundcloud: false,
    playedYoutube: 0,
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  onProgressYoutube = ({ playedSeconds }) => {
    // Synchronize Soundcloud player progress with Youtube player progress by checking Youtube progress change interval (larger than 1.02s)
    if (Math.abs(playedSeconds - this.state.playedYoutube) > interval) {
      this.playerSoundcloud.seekTo(playedSeconds);
    }
    this.setState({ playedYoutube: playedSeconds });
  };

  ref = playerSoundcloud => {
    this.playerSoundcloud = playerSoundcloud;
  };

  render() {
    const { id } = this.props;
    return (
      <Query
        query={VIDEO_QUERY}
        variables={{
          id,
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>Loading...</p>;
          if (!data.video) return <p>No Video Found for {id}</p>;
          const { video } = data;
          return (
            <div>
              <Head>
                <title>Danni | {video.title}</title>
              </Head>
              <div>
                <h2>{video.title}</h2>
                <YouTubePlayer
                  url={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  muted
                  controls
                  playing
                  onPause={() => this.setState({ playingSoundcloud: false })}
                  onPlay={() => this.setState({ playingSoundcloud: true })}
                  onProgress={this.onProgressYoutube}
                />
                <SoundCloud>
                  <SoundCloudPlayer
                    ref={this.ref}
                    url="https://soundcloud.com/user-566264679/addiction-cz"
                    playing={this.state.playingSoundcloud}
                  />
                </SoundCloud>
              </div>
            </div>
          );
        }}
      </Query>
    );
  }
}

export default Watch;
export { VIDEO_QUERY };
