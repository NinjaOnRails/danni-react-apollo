import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import styled from 'styled-components';
import { Grid, Loader } from 'semantic-ui-react';
import VideoList from './VideoList';
import CommentList from '../Comment/CommentList';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../ui/ErrorMessage';

const VIDEO_QUERY = gql`
  query VIDEO_QUERY($id: ID!, $audioId: ID) {
    video(where: { id: $id }) {
      id
      originId
      originPlatform
      originLanguage
      originTitle
      originDescription
      originAuthor
      originThumbnailUrl
      originThumbnailUrlSd
      addedBy {
        displayName
      }
      language
      audio(where: { id: $audioId }) {
        id
        source
        author {
          displayName
        }
        language
        title
        description
        defaultVolume
        startAt
      }
    }
  }
`;

const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: 1366px;
  padding: 0px 24px 0px 24px;
  .filePlayer {
    display: none; /* Hide audio File Player */
  }
  @media (max-width: 760px) {
    padding: 0px;
  }
  @media (max-width: 480px) {
    div.eleven.wide.computer.sixteen.wide.mobile.sixteen.wide.tablet.column {
      padding: 0;
    }
  }
`;

const YoutubeStyle = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  /* Create element on top of Youtube Player to limit interaction */
  :before {
    content: '';
    position: absolute;
    height: 78%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    /* background: red; */
    @media (min-width: 793px) {
      position: absolute;
      height: 85%;
    }
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
    readyYoutube: false,
    playbackRates: [],
    playbackRate: 1,
    showFullDescription: false,
  };

  componentDidUpdate(prevProps) {
    const { id, audioId } = this.props;

    if (id !== prevProps.id || audioId !== prevProps.audioId)
      this.youtubePlayer.getInternalPlayer().unMute();
  }

  onProgressYoutube = ({ playedSeconds }) => {
    // Auto mute video
    if (!this.youtubePlayer.getInternalPlayer().isMuted()) {
      this.youtubePlayer.getInternalPlayer().mute();
    }

    // Synchronise FilePlayer progress with Youtube player progress within 2 seconds
    // to allow for synchronised seeking
    const { playedYoutube, playedFilePlayer } = this.state;
    if (
      playedFilePlayer > 0 &&
      playedYoutube > 0 &&
      playedSeconds !== playedYoutube
    ) {
      if (Math.abs(playedFilePlayer - playedYoutube) > 2) {
        this.filePlayer.seekTo(playedSeconds);
      }
    }
    this.setState({
      playedYoutube: playedSeconds,
    });
  };

  onYoutubeStart = ({
    audio,
    language,
    id,
    originTitle,
    originPlatform,
    originLanguage,
    originAuthor,
    addedBy: { displayName },
  }) => {
    // Send stats to Mixpanel on play start
    mixpanel.track('Audio Play', {
      'Audio ID': audio[0] ? audio[0].id : 'no-audio',
      'Audio Language': audio[0] ? audio[0].language : language,
      'Audio Author': audio[0] ? audio[0].displayName : 'no-audio',
      'Video ID': id,
      'Video Title': originTitle,
      'Video Platform': originPlatform,
      'Video Language': originLanguage,
      'Video Author': originAuthor,
      'Video AddedBy': displayName,
    });
  };

  hideFullDescription = () => {
    this.setState({ showFullDescription: false });
  };

  toggleFullDescription = () => {
    this.setState({ showFullDescription: !this.state.showFullDescription });
  };

  renderVideoPlayer = video => {
    const { playingFilePlayer, playbackRate } = this.state;
    return (
      <YoutubeStyle
        onClick={() =>
          this.setState({
            playingFilePlayer: !playingFilePlayer,
          })
        }
      >
        <YouTubePlayer
          className="youtube-player"
          url={`https://www.youtube.com/embed/${video.originId}`}
          width="100%"
          height="100%"
          onReady={() =>
            this.setState({
              readyYoutube: true,
              playbackRates: this.youtubePlayer
                .getInternalPlayer()
                .getAvailablePlaybackRates(),
            })
          }
          playing={playingFilePlayer}
          controls
          onPause={() => this.setState({ playingFilePlayer: false })}
          onPlay={() => this.setState({ playingFilePlayer: true })}
          onProgress={e => {
            if (video.audio[0]) this.onProgressYoutube(e);
          }}
          onStart={() => this.onYoutubeStart(video)}
          ref={youtubePlayer => {
            this.youtubePlayer = youtubePlayer;
          }}
          playbackRate={playbackRate}
        />
      </YoutubeStyle>
    );
  };

  renderFilePlayer = audio => {
    const { playingFilePlayer, playbackRate } = this.state;
    return (
      <FilePlayer
        className="filePlayer"
        config={{
          file: {
            forceAudio: true,
          },
        }}
        onProgress={e => {
          this.setState({
            playedFilePlayer: e.playedSeconds,
          });
        }}
        ref={filePlayer => {
          this.filePlayer = filePlayer;
        }}
        url={audio[0].source}
        playing={playingFilePlayer}
        onPause={() => this.setState({ playingFilePlayer: false })}
        height="100%"
        width="100%"
        playbackRate={playbackRate}
      />
    );
  };

  render() {
    const { id, audioId } = this.props;
    const { readyYoutube, showFullDescription } = this.state;
    const url = `http://danni.tv/watch?id=${id}${
      audioId ? `&audioId=${audioId}` : ''
    }`;
    return (
      <Query
        query={VIDEO_QUERY}
        variables={{
          id,
          audioId,
        }}
      >
        {({ error, loading, data: { video } }) => {
          if (error) return <Error error={error} />;
          if (loading) return <Loader active inline="centered" />;
          if (!video) return <p>No Video Found for {id}</p>;
          return (
            <>
              <VideoHeader video={video} url={url} />
              <StyledContainer>
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={11}>
                      {this.renderVideoPlayer(video)}
                      <VideoInfo
                        {...this.props}
                        video={video}
                        url={url}
                        showFullDescription={showFullDescription}
                        toggleFullDescription={this.toggleFullDescription}
                      />
                      {video.audio[0] &&
                        readyYoutube &&
                        this.renderFilePlayer(video.audio)}
                      <CommentList />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={5}>
                      <VideoList
                        {...this.props}
                        hideFullDescription={this.hideFullDescription}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </StyledContainer>
            </>
          );
        }}
      </Query>
    );
  }
}

Watch.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

Watch.defaultProps = {
  audioId: '',
};

export default Watch;
export { VIDEO_QUERY };
