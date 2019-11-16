import React, { Component } from 'react';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { Container, Loader } from 'semantic-ui-react';
import SmallVideoList from './SmallVideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import { WatchPageStyles, YoutubeStyle } from '../styles/WatchStyles';
import {
  trackPlayStart,
  trackPlayFinish,
  trackPlayedDuration,
} from '../../lib/mixpanel';

class Watch extends Component {
  state = {
    playingFilePlayer: false,
    playedYoutube: 0,
    playedFilePlayer: 0,
    readyYoutube: false,
    playbackRates: [],
    playbackRate: 1,
    showFullDescription: false,
    mixpanelEventsSent: [],
  };

  componentDidUpdate(prevProps) {
    const { id, audioId } = this.props;
    const { readyYoutube } = this.state;

    if (
      this.youtubePlayer &&
      (id !== prevProps.id || audioId !== prevProps.audioId)
    ) {
      this.setState({
        playedFilePlayer: 0,
        playedYoutube: 0,
        readyYoutube: false,
      });
      if (readyYoutube) this.youtubePlayer.getInternalPlayer().unMute(); // Unmute after auto mute below in case new video opened has no separate audio
    }
  }

  onProgressYoutube = (e, video) => {
    const { playedYoutube, playedFilePlayer, mixpanelEventsSent } = this.state;
    const { playedSeconds } = e;

    // Synchronise FilePlayer progress with Youtube player progress within 2 seconds
    // to allow for synchronised seeking
    if (video.audio[0]) {
      // Auto mute video
      if (!this.youtubePlayer.getInternalPlayer().isMuted()) {
        this.youtubePlayer.getInternalPlayer().mute();
      }
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
    }

    // Video Play Mixpanel tracking
    const eventSent = trackPlayedDuration({ e, video, mixpanelEventsSent });
    if (eventSent) {
      this.setState({
        mixpanelEventsSent: [...mixpanelEventsSent, eventSent],
      });
    }
  };

  onReadyYoutube = () => {
    this.setState({
      readyYoutube: true,
      playbackRates: this.youtubePlayer
        .getInternalPlayer()
        .getAvailablePlaybackRates(),
    });
  };

  onVideoItemClick = client => {
    // Reset some states on different video click
    this.setState({ showFullDescription: false, mixpanelEventsSent: [] });
  };

  toggleFullDescription = () => {
    const { showFullDescription } = this.state;
    this.setState({ showFullDescription: !showFullDescription });
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
          onReady={() => this.onReadyYoutube()}
          playing={playingFilePlayer}
          controls
          onPause={() => this.setState({ playingFilePlayer: false })}
          onPlay={() => this.setState({ playingFilePlayer: true })}
          onProgress={e => this.onProgressYoutube(e, video)}
          onStart={() => trackPlayStart(video)}
          onEnded={() => trackPlayFinish(video)}
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
    const {
      id,
      asPath,
      payload: { error, loading, data },
      client,
    } = this.props;
    const { readyYoutube, showFullDescription } = this.state;
    const url = `https://www.danni.tv${asPath}
    `;
    if (error) return <Error error={error} />;
    if (loading) return <Loader active inline="centered" />;
    const { video } = data;
    if (!video) return <p>No Video Found for ID: {id}</p>;
    const currentWatchingLanguage = video.audio[0]
      ? video.audio[0].language
      : video.language;
    return (
      <>
        <VideoHeader video={video} url={url} />
        <WatchPageStyles>
          <div className="main">
            {this.renderVideoPlayer(video)}
            <Container fluid className="tablet-padding">
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
              <CommentSection
                videoId={id}
                videoLanguage={video.language}
                client={client}
              />
            </Container>
          </div>
          <div className="list tablet-padding">
            <SmallVideoList
              {...this.props}
              currentWatchingLanguage={currentWatchingLanguage}
              onVideoItemClick={() => this.onVideoItemClick(client)}
            />
          </div>
        </WatchPageStyles>
      </>
    );
  }
}

Watch.propTypes = {
  id: PropTypes.string.isRequired,
  asPath: PropTypes.string.isRequired,
  payload: PropTypes.object.isRequired,
  audioId: PropTypes.string,
  client: PropTypes.object.isRequired,
};

Watch.defaultProps = {
  audioId: null,
};

export default Watch;
