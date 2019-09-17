import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { Container, Grid, Loader } from 'semantic-ui-react';
import VideoList from './VideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import { StyledContainer, YoutubeStyle } from '../styles/WatchStyles';
import {
  trackPlayStart,
  trackPlayFinish,
  trackPlayedDuration,
} from '../../lib/mixpanel';

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
      duration
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
        duration
      }
    }
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
    mixpanelEventsSent: [],
  };

  componentDidMount() {
    this.props.client.writeData({ data: { hideSignin: true } });
  }

  componentDidUpdate(prevProps) {
    const { id, audioId } = this.props;

    if (
      this.youtubePlayer &&
      (id !== prevProps.id || audioId !== prevProps.audioId)
    )
      this.youtubePlayer.getInternalPlayer().unMute(); // Unmute after auto mute below in case new video opened has no separate audio
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
    const eventSent = trackPlayedDuration(e, video, mixpanelEventsSent);
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
    client.writeData({ data: { hideSigninToComment: true } });
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
    const { id, audioId, client } = this.props;
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
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <Loader active inline="centered" />;
          const { video } = data;
          if (!video) return <p>No Video Found for {id}</p>;
          const currentWatchingLanguage = video.audio[0]
            ? video.audio[0].language
            : video.language;
          return (
            <>
              <VideoHeader video={video} url={url} />
              <StyledContainer>
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={11}>
                      {this.renderVideoPlayer(video)}
                      <Container fluid>
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
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={5}>
                      <VideoList
                        {...this.props}
                        currentWatchingLanguage={currentWatchingLanguage}
                        onVideoItemClick={() => this.onVideoItemClick(client)}
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
  client: PropTypes.object.isRequired,
  audioId: PropTypes.string,
};

Watch.defaultProps = {
  audioId: '',
};

export default Watch;
export { VIDEO_QUERY };
