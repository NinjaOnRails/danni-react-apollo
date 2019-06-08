import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { isMobile } from 'react-device-detect';
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

const YoutubeStyle = styled.div`
  position: relative;
  padding-top: 56.25%;
  /* Create element on top of Youtube Player to limit interaction */
  :before {
    content: '';
    position: absolute;
    height: 85%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
  }
  .youtube-player {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

class Watch extends Component {
  state = {
    playingFilePlayer: false,
    playedYoutube: 0,
    playedFilePlayer: 0,
    password: '',
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // Synchronize FilePlayer progress with Youtube player progress within 2 seconds
  onProgressYoutube = ({ playedSeconds }) => {
    const { playedYoutube, playedFilePlayer } = this.state;
    if (
      playedFilePlayer > 0 &&
      playedYoutube > 0 &&
      playedSeconds !== playedYoutube
    ) {
      if (Math.abs(playedFilePlayer - playedYoutube) > 2) {
        this.playerFilePlayer.seekTo(playedSeconds);
      }
    }
    this.setState({ playedYoutube: playedSeconds });
  };

  refFilePlayer = playerFilePlayer => {
    this.playerFilePlayer = playerFilePlayer;
  };

  render() {
    const { id } = this.props;
    const { password, playingFilePlayer } = this.state;
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
                  audio,
                  originAuthor,
                  defaultVolume,
                  originId,
                },
              } = data;

              return (
                <div>
                  <Head>
                    <title>Danni | {titleVi}</title>
                  </Head>
                  <div>
                    <h2>{titleVi}</h2>
                    <YoutubeStyle
                      onClick={() =>
                        this.setState({
                          playingFilePlayer: !playingFilePlayer,
                        })
                      }
                    >
                      <YouTubePlayer
                        className="youtube-player"
                        url={`https://www.youtube.com/embed/${originId}`}
                        width="100%"
                        height="100%"
                        muted={isMobile}
                        volume={defaultVolume / 100}
                        playing={playingFilePlayer}
                        controls
                        onPause={() =>
                          this.setState({ playingFilePlayer: false })
                        }
                        onPlay={() =>
                          this.setState({ playingFilePlayer: true })
                        }
                        onProgress={this.onProgressYoutube}
                      />
                    </YoutubeStyle>
                    Tác giả: {originAuthor}
                    {audio[0] && (
                      <FilePlayer
                        onProgress={({ playedSeconds }) =>
                          this.setState({ playedFilePlayer: playedSeconds })
                        }
                        ref={this.refFilePlayer}
                        url={audio[0].source}
                        playing={playingFilePlayer}
                      />
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
