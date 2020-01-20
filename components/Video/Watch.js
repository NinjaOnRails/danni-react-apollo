import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { YoutubeStyle } from '../styles/WatchStyles';
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
      //   playbackRates: this.youtubePlayer
      //     .getInternalPlayer()
      //     .getAvailablePlaybackRates(),
    });
  };

  onVideoItemClick = () => {
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
        <ReactPlayer
          className="youtube-player"
          // url="https://www.facebook.com/NasDailyVietnamese/videos/457978568180650"
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
          // config={{ facebook: { appId: '398428117464454' } }}
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
    const { readyYoutube } = this.state;
    const { video } = this.props;
    return (
      <>
        {this.renderVideoPlayer(video)}
        {video.audio[0] && readyYoutube && this.renderFilePlayer(video.audio)}
      </>
    );
  }
}

Watch.propTypes = {
  id: PropTypes.string.isRequired,
  video: PropTypes.object.isRequired,
  audioId: PropTypes.string,
};

Watch.defaultProps = {
  audioId: null,
};

export default Watch;
