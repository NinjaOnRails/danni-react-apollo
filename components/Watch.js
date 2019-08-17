import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { Segment, Header, Loader } from 'semantic-ui-react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import Error from './ErrorMessage';
import YoutubeViews from './YoutubeViews';

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

const YoutubeStyle = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 25px;
  height: 0;
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
    /* @media (min-width: 515px) {
      position: absolute;
      height: 85%;
    } */
    /* @media (min-width: 655px) {
      position: absolute;
      height: 88%;
    }
    @media (min-width: 1300px) {
      position: absolute;
      height: 91%;
    } */
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
  };

  componentDidUpdate(prevProps) {
    const { id } = this.props;
    if (id !== prevProps.id && isMobile)
      this.setState({ playingFilePlayer: false });
  }

  // Synchronize FilePlayer progress with Youtube player progress within 2 seconds
  // to allow for synchronised seeking
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
    const { id, audioId } = this.props;
    const { playingFilePlayer } = this.state;
    const audioQueryParam = audioId ? `&audioId=${audioId}` : '';
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
          if (!data.video) return <p>No Video Found for {id}</p>;
          const {
            video: {
              originTitle,
              originDescription,
              originPlatform,
              originLanguage,
              audio,
              originAuthor,
              originId,
              originThumbnailUrlSd,
              originThumbnailUrl,
              addedBy: { displayName },
              language,
            },
          } = data;

          return (
            <>
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
                  content={originThumbnailUrl || originThumbnailUrlSd}
                />
                <meta property="og:locale" content={originLanguage || ''} />
                <meta
                  property="og:description"
                  content={audio[0] ? audio[0].description : originDescription}
                />
                <meta property="fb:app_id" content="444940199652956" />
              </Head>
              <div>
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
                    muted={isMobile && audio[0]}
                    volume={audio[0] ? audio[0].defaultVolume / 100 : 1}
                    playing={playingFilePlayer}
                    controls
                    onPause={() => this.setState({ playingFilePlayer: false })}
                    onPlay={() => this.setState({ playingFilePlayer: true })}
                    onProgress={e => audio[0] && this.onProgressYoutube(e)}
                    onStart={() =>
                      // Send stats to Mixpanel on play start
                      mixpanel.track('Audio Play', {
                        'Audio ID': audio[0] ? audio[0].id : 'no-audio',
                        'Audio Language': audio[0]
                          ? audio[0].language
                          : language,
                        'Audio Author': audio[0]
                          ? audio[0].displayName
                          : 'no-audio',
                        'Video ID': id,
                        'Video Title': originTitle,
                        'Video Platform': originPlatform,
                        'Video Language': originLanguage,
                        'Video Author': originAuthor,
                        'Video AddedBy': displayName,
                      })
                    }
                  />
                </YoutubeStyle>
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
                          url={`http://danni.tv/watch?id=${id}&${audioQueryParam}`}
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
                        <h3>Người đọc: {displayName}</h3>
                      </Header>
                    )}
                    {(audio[0] && audio[0].description && (
                      <div className="description">{audio[0].description}</div>
                    )) ||
                      (originDescription && (
                        <div className="description">{originDescription}</div>
                      ))}
                  </Segment>
                </VideoInfoStyle>
                {audio[0] && (
                  <FilePlayer
                    config={{
                      file: {
                        forceAudio: true,
                      },
                    }}
                    onProgress={({ playedSeconds }) =>
                      this.setState({ playedFilePlayer: playedSeconds })
                    }
                    ref={this.refFilePlayer}
                    url={audio[0].source}
                    playing={playingFilePlayer}
                    onPause={() => this.setState({ playingFilePlayer: false })}
                    height="100%"
                    width="100%"
                  />
                )}
              </div>
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
