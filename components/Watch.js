import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import SoundCloudPlayer from 'react-player/lib/players/SoundCloud';
import styled from 'styled-components';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';

const VIDEO_QUERY = gql`
  query VIDEO_QUERY($id: ID!) {
    video(where: { id: $id }) {
      id
      originId
      titleVi
      originAuthor
      originThumbnailUrl
      originLanguage
      defaultVolume
      startAt
      audio {
        id
        source
      }
      createdAt
    }
  }
`;

const VIDEO_DELETE = gql`
  mutation VIDEO_DELETE($id: ID!, $password: String!) {
    deleteVideo(id: $id, password: $password) {
      id
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
    password: '',
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
    const { password, playingSoundcloud } = this.state;
    return (
      <Mutation
        mutation={VIDEO_DELETE}
        refetchQueries={[{ query: ALL_VIDEOS_QUERY }]}
      >
        {(deleteVideo, { error }) => (
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
                video: {
                  id: idInDB,
                  titleVi,
                  originId,
                  startAt,
                  defaultVolume,
                  audio,
                },
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
                      volume={defaultVolume / 100}
                      // playing
                      // muted
                      controls
                      onPause={() =>
                        this.setState({ playingSoundcloud: false })
                      }
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
                        playing={playingSoundcloud}
                      />
                      // </SoundCloudStyles>
                    )}
                  </div>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => this.setState({ password: e.target.value })}
                  />
                  <button
                    type="submit"
                    onClick={async () => {
                      if (password !== 'delete') {
                        alert('Wrong delete password');
                      } else if (
                        confirm('Are you sure you want to delete this video?')
                      ) {
                        const res = await deleteVideo({
                          variables: { id: idInDB, password },
                        }).catch(err => {
                          alert(err.message);
                        });
                        if (res.data)
                          Router.push({
                            pathname: '/',
                          });
                      }
                    }}
                  >
                    Delete
                  </button>
                </div>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default Watch;
export { VIDEO_QUERY };
