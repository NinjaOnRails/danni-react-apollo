import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import styled from 'styled-components';
import { Grid, Segment, Header, Loader } from 'semantic-ui-react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import Error from './ErrorMessage';
import YoutubeViews from './YoutubeViews';
import VideoList from './VideoList';
import CommentList from './CommentList';

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

const VideoInfoStyle = styled.div`
  margin-bottom: 10px;
  h1,
  h2,
  .description {
    font-family: ${props => props.theme.font};
    word-break: break-word;
  }
  .fb-share-button {
    float: right;
    cursor: pointer;
  }
  .basic-info {
    margin-top: 10px;
  }
  .views-social {
    display: flex;
    justify-content: space-between;
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

    if (id !== prevProps.id || audioId !== prevProps.audioId) {
      this.setState({ showFullDescription: false });
      this.renderedYoutubePlayer.getInternalPlayer().unMute();
    }
  }

  onProgressYoutube = ({ playedSeconds }) => {
    // Auto mute video
    if (!this.renderedYoutubePlayer.getInternalPlayer().isMuted()) {
      this.renderedYoutubePlayer.getInternalPlayer().mute();
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
        this.renderedFilePlayer.seekTo(playedSeconds);
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

  refFilePlayer = renderedFilePlayer => {
    this.renderedFilePlayer = renderedFilePlayer;
  };

  refYoutubePlayer = renderedYoutubePlayer => {
    this.renderedYoutubePlayer = renderedYoutubePlayer;
  };

  renderHead = (
    id,
    {
      audio,
      originTitle,
      originThumbnailUrl,
      originThumbnailUrlSd,
      originLanguage,
      originDescription,
    },
    audioQueryParam
  ) => (
    <Head>
      <title>Danni | {audio[0] ? audio[0].title : originTitle}</title>
      <meta
        property="og:url"
        content={`http://danni.tv/watch?id=${id}${audioQueryParam}`}
      />
      <meta
        property="og:title"
        content={audio[0] ? audio[0].title : originTitle}
      />
      <meta
        property="og:image"
        content={originThumbnailUrlSd || originThumbnailUrl}
      />
      <meta property="og:locale" content={originLanguage || ''} />
      <meta
        property="og:description"
        content={
          audio[0] && audio[0].description
            ? audio[0].description
            : originDescription
        }
      />
      <meta property="fb:app_id" content="444940199652956" />
    </Head>
  );

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
              playbackRates: this.renderedYoutubePlayer
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
          ref={this.refYoutubePlayer}
          playbackRate={playbackRate}
        />
      </YoutubeStyle>
    );
  };

  toggleDescription() {
    this.setState({ showFullDescription: !this.state.showFullDescription });
  }

  renderVideoInfo = (
    id,
    {
      audio,
      originTitle,
      originId,
      originAuthor,
      addedBy: { displayName },
      originDescription,
    },
    audioQueryParam
  ) => {
    let description;
    const { showFullDescription } = this.state;
    if (audio[0] && audio[0].description) {
      description = audio[0].description;
    } else if (originDescription) {
      description = originDescription;
    }
    const wordsArray = description.split(' ');
    // Take first 40 words
    const firstHalf = wordsArray.slice(0, 20).join(' ');
    const secondHalf = wordsArray.slice(20).join(' ');
    return (
      <VideoInfoStyle>
        <div className="basic-info">
          <Header>
            <h1>{audio[0] ? audio[0].title : originTitle}</h1>
          </Header>
          <div className="views-social">
            <YoutubeViews originId={originId} />
            <div>
              <FacebookShareButton
                className="fb-share-button"
                url={`https://danni.tv/watch?id=${id}${audioQueryParam}`}
              >
                <FacebookIcon size={32} round />
              </FacebookShareButton>
            </div>
          </div>
        </div>
        <Segment>
          <Header>
            <h2>Kênh: {originAuthor}</h2>
          </Header>
          {(audio[0] && (
            <Header>
              <h3>Người đọc: {audio[0].author.displayName}</h3>
            </Header>
          )) || (
            <Header>
              <h3>Người đăng: {displayName}</h3>
            </Header>
          )}
          <div className="description">
            {firstHalf}
            {showFullDescription ? secondHalf : ' ...'}
          </div>
          {secondHalf.length > 20 && (
            <button
              onClick={() => this.toggleDescription()}
              className="ui button"
            >
              {showFullDescription ? 'Show less' : 'Show more'}
            </button>
          )}
        </Segment>
      </VideoInfoStyle>
    );
  };

  renderFilePlayer = audio => {
    const { playingFilePlayer, playbackRate } = this.state;
    return (
      <FilePlayer
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
        ref={this.refFilePlayer}
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
    const { readyYoutube } = this.state;
    const audioQueryParam = audioId ? `&audioId=${audioId}` : '';
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
              {this.renderHead(id, video, audioQueryParam)}
              <StyledContainer>
                <Grid>
                  <Grid.Row>
                    <Grid.Column mobile={16} tablet={16} computer={11}>
                      {this.renderVideoPlayer(video)}
                      {this.renderVideoInfo(id, video, audioQueryParam)}
                      {video.audio[0] &&
                        readyYoutube &&
                        this.renderFilePlayer(video.audio)}
                      <CommentList />
                    </Grid.Column>
                    <Grid.Column mobile={16} tablet={16} computer={5}>
                      <VideoList {...this.props} />
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
