import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Head from 'next/head';
import Router from 'next/router';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
// import ReactPlayer from 'react-player';
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

const YoutubeOverlay = styled.div`
  position: relative;
  height: 360px;
  width: 640px;
  :before {
    content: '';
    position: absolute;
    height: 85%;
    width: 100%;
  }
`;

// Interval to be counted as Youtube seek change in seconds
const interval = 1.02;

class Watch extends Component {
  state = {
    playingFilePlayer: false,
    playingYouPlayer: false,
    playedYoutube: 0,
    password: '',
    mobileFirstInteract: false,
  };

  static propTypes = {
    id: PropTypes.string.isRequired,
  };

  // Synchronize FilePlayer progress with Youtube player progress on Youtube seek change
  onProgressYoutube = ({ playedSeconds }) => {
    if (this.playerFilePlayer) {
      if (Math.abs(playedSeconds - this.state.playedYoutube) > interval) {
        this.playerFilePlayer.seekTo(playedSeconds);
      }
      this.setState({ playedYoutube: playedSeconds });
    }
  };

  refFilePlayer = playerFilePlayer => {
    this.playerFilePlayer = playerFilePlayer;
  };

  renderYoutube({ defaultVolume, originId }) {
    const { playingFilePlayer, mobileFirstInteract, playingYouPlayer } = this.state;
    // if (!isMobile || mobileFirstInteract) {
    return (
      <YoutubeOverlay
        onClick={() =>
          this.setState({
            playingYouPlayer: !playingYouPlayer,
          })
        }
      >
        <YouTubePlayer
          url={`https://www.youtube.com/embed/${originId}`}
          muted={isMobile}
          volume={defaultVolume / 100}
          playing={playingYouPlayer}
          controls
          onPause={() => this.setState({ playingFilePlayer: false })}
          onPlay={() => this.setState({ playingFilePlayer: true })}
          onProgress={this.onProgressYoutube}
        />
      </YoutubeOverlay>
    );
    // }

    // return (
    //   <YoutubeOverlay
    //     onClick={() =>
    //       this.setState({
    //         playingFilePlayer: !playingFilePlayer,
    //       })
    //     }
    //   >
    //     <YouTubePlayer url={`https://www.youtube.com/embed/${originId}`} />
    //   </YoutubeOverlay>
    // );
  }

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
                video: { id: idInDB, titleVi, audio, originAuthor },
              } = data;

              return (
                <div>
                  <Head>
                    <title>Danni | {titleVi}</title>
                  </Head>
                  <div>
                    <h2>{titleVi}</h2>
                    {this.renderYoutube(data.video)}
                    Tác giả: {originAuthor}
                    {audio[0] && (
                      <FilePlayer
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
