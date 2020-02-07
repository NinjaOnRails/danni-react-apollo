import React, { Component } from 'react';
import { isMobile } from 'mobile-device-detect';
import Router from 'next/router';
import Link from 'next/link';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { Button, Icon } from 'semantic-ui-react';
import { YoutubeStyle } from '../styles/WatchStyles';
import {
  trackPlayStart,
  trackPlayFinish,
  trackPlayedDuration,
} from '../../lib/mixpanel';
import { LOCAL_STATE_QUERY } from '../../graphql/query';

class Watch extends Component {
  state = {
    playingFilePlayer: false,
    playedYoutube: 0,
    playedFilePlayer: 0,
    readyYoutube: false,
    playbackRates: [],
    playbackRate: 1,
    mixpanelEventsSent: [],
    nextVidCountdown: 5,
    intervalId: null,
    showNextVideo: false,
  };

  componentDidUpdate(prevProps) {
    const { id, audioId } = this.props;
    const { readyYoutube, nextVidCountdown } = this.state;

    if (
      this.youtubePlayer &&
      (id !== prevProps.id || audioId !== prevProps.audioId)
    ) {
      if (isMobile) this.setState({ playingFilePlayer: false });
      this.setState({
        playedFilePlayer: 0,
        playedYoutube: 0,
        readyYoutube: false,
      });
      if (readyYoutube) this.youtubePlayer.getInternalPlayer().unMute(); // Unmute after auto mute below in case new video opened has no separate audio
    }
    if (nextVidCountdown < 0) {
      this.onNextVideoClick();
    }
  }

  componentWillUnmount() {
    // this.cancelCountdown();
    clearInterval(this.state.intervalId);
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

  onNextVideoClick = () => {
    const {
      nextVideo: { id, audioId },
    } = this.props;
    const query = { id };
    if (audioId) query.audioId = audioId;
    this.cancelCountdown();
    Router.push({
      pathname: '/watch',
      query,
    });
  };

  onReadyYoutube = () => {
    this.setState({
      readyYoutube: true,
      //   playbackRates: this.youtubePlayer
      //     .getInternalPlayer()
      //     .getAvailablePlaybackRates(),
    });
  };

  startCountdown = () => {
    this.setState(({ nextVidCountdown }) => ({
      nextVidCountdown: nextVidCountdown - 1,
    }));
  };

  cancelCountdown = () => {
    const { intervalId } = this.state;
    this.setState({ nextVidCountdown: 5, showNextVideo: false });
    if (intervalId) clearInterval(intervalId);
  };

  renderVideoPlayer = allowAutoplay => {
    const {
      playingFilePlayer,
      playbackRate,
      nextVidCountdown,
      showNextVideo,
    } = this.state;
    const { video, nextVideo, audioId } = this.props;
    return (
      <YoutubeStyle
        onClick={() =>
          this.setState({
            playingFilePlayer: !playingFilePlayer,
          })
        }
        nextThumbnail={nextVideo.thumbnail}
        showNextVideo={nextVidCountdown === 0}
      >
        {showNextVideo && (
          <div className="next-video-overlay">
            <h4 id="next-text">Tiếp theo:</h4>
            <p id="next-title">{nextVideo.title}</p>
            <div id="thumb-count">
              <Link
                href={`/watch?id=${nextVideo.id}${
                  nextVideo.audioId ? `&audioId=${nextVideo.audioId}` : ''
                }`}
              >
                <a onClick={this.cancelCountdown}>
                  <img
                    src={nextVideo.thumbnail}
                    alt="Next video thumbnail"
                    id="next-thumbnail"
                  />
                </a>
              </Link>
              <div id="next-count">{nextVidCountdown}</div>
            </div>
            <div id="next-actions">
              <Button onClick={this.cancelCountdown}>
                <Icon name="cancel" /> Huỷ
              </Button>

              <Button onClick={this.onNextVideoClick}>
                <Icon name="step forward" /> Xem Tiếp
              </Button>
            </div>
          </div>
        )}

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
          onPlay={() => {
            this.cancelCountdown();
            this.setState({ playingFilePlayer: true });
          }}
          onProgress={e => this.onProgressYoutube(e, video)}
          onStart={() => trackPlayStart(video)}
          onEnded={() => {
            trackPlayFinish(video);
            if (allowAutoplay && !audioId) {
              this.setState({
                showNextVideo: true,
                intervalId: setInterval(this.startCountdown, 1000),
              });
            }
          }}
          ref={youtubePlayer => {
            this.youtubePlayer = youtubePlayer;
          }}
          playbackRate={playbackRate}

          // config={{ facebook: { appId: '398428117464454' } }}
        />
      </YoutubeStyle>
    );
  };

  renderFilePlayer = (audio, allowAutoplay) => {
    const { playingFilePlayer, playbackRate } = this.state;
    return (
      <FilePlayer
        className="filePlayer"
        config={{
          file: {
            forceAudio: true,
          },
        }}
        onEnded={() => {
          if (allowAutoplay) {
            this.setState({
              showNextVideo: true,
              intervalId: setInterval(this.startCountdown, 1000),
            });
          }
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
      <Query query={LOCAL_STATE_QUERY}>
        {({ data: { allowAutoplay } }) => {
          return (
            <>
              {this.renderVideoPlayer(allowAutoplay)}
              {video.audio[0] &&
                readyYoutube &&
                this.renderFilePlayer(video.audio, allowAutoplay)}
            </>
          );
        }}
      </Query>
    );
  }
}

Watch.propTypes = {
  id: PropTypes.string.isRequired,
  video: PropTypes.object.isRequired,
  audioId: PropTypes.string,
  nextVideo: PropTypes.object.isRequired,
};

Watch.defaultProps = {
  audioId: null,
};

export default Watch;
