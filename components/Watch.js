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
      originId
      titleVi
      originAuthor
      originThumbnailUrl
      originLanguage
      startAt
      audio {
        id
        source
      }
      createdAt
    }
  }
`;

const SoundCloudStyles = styled.div`
  iframe {
    width: 0;
    height: 0;
    border: 0;
    border: none;
    position: absolute;
  }
`;

// Interval to be counted as Youtube seek change in seconds
const interval = 1.02;

class Watch extends Component {
  state = {
    playingSoundcloud: false,
    playedYoutube: 0,
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // Synchronize Soundcloud player progress with Youtube player progress on Youtube seek change
  onProgressYoutube = ({ playedSeconds }) => {
    if (this.playerSoundcloud) {
      if (Math.abs(playedSeconds - this.state.playedYoutube) > interval) {
        this.playerSoundcloud.seekTo(playedSeconds);
      }
      this.setState({ playedYoutube: playedSeconds });
    }
  };

  // Soundcloud player association variable
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
          const {
            video: { titleVi, originId, startAt, audio },
          } = data;

          // Soundcloud startAt param
          const startAtSoundcloud =
            startAt <= 0
              ? ''
              : `#t=${Math.floor(startAt / 3600)}h${Math.floor(
                  startAt / 60
                )}m${Math.floor(startAt % 60)}s`;

          return (
            <div>
              <Head>
                <title>Danni | {titleVi}</title>
              </Head>
              <div>
                <h2>{titleVi}</h2>
                <YouTubePlayer
                  url={`https://www.youtube.com/watch?v=${originId}?t=${startAt.toString()}`}
                  // volume={0.08}
                  // playing
                  muted
                  controls
                  onPause={() => this.setState({ playingSoundcloud: false })}
                  onPlay={() => this.setState({ playingSoundcloud: true })}
                  onProgress={this.onProgressYoutube}
                />
                {audio[0] && (
                  // <SoundCloudStyles>
                  <SoundCloudPlayer
                    ref={this.ref}
                    url={audio[0].source + startAtSoundcloud}
                    // height="0%"
                    // width="0%"
                    playing={this.state.playingSoundcloud}
                  />
                  // </SoundCloudStyles>
                )}
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
