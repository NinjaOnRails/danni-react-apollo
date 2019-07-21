import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import Head from 'next/head';
import { withRouter } from 'next/router';
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
  query VIDEO_QUERY($id: ID!) {
    video(where: { id: $id }) {
      id
      originId
      titleVi
      descriptionVi
      originAuthor
      originThumbnailUrl
      originThumbnailUrlSd
      defaultVolume
      startAt
      audio {
        id
        source
        author
        language
      }
      tags {
        text
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

  static propTypes = {
    router: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    console.log(process.env.YOUTUBE_API_KEY)
    const {
      router: {
        query: { id },
      },
    } = this.props;
    if (id !== prevProps.router.query.id && isMobile)
      this.setState({ playingFilePlayer: false });
  }

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
    const {
      router: {
        query: { id },
      },
    } = this.props;
    const { playingFilePlayer } = this.state;
    return (
      <Query
        query={VIDEO_QUERY}
        variables={{
          id,
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <Loader active inline="centered" />;
          if (!data.video) return <p>No Video Found for {id}</p>;
          const {
            video: {
              titleVi,
              descriptionVi,
              audio,
              originAuthor,
              defaultVolume,
              originId,
              originThumbnailUrlSd,
            },
          } = data;

          return (
            <>
              <Head>
                <title>Danni | {titleVi}</title>
                <meta
                  property="og:url"
                  content={`http://danni.tv/watch?id=${id}`}
                />
                <meta property="og:title" content={titleVi} />
                <meta property="og:image" content={originThumbnailUrlSd} />
                <meta property="og:locale" content="vi_VN" />
                <meta property="og:description" content={descriptionVi} />
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
                    muted={isMobile && audio.length !== 0}
                    volume={defaultVolume / 100}
                    playing={playingFilePlayer}
                    controls
                    onPause={() => this.setState({ playingFilePlayer: false })}
                    onPlay={() => this.setState({ playingFilePlayer: true })}
                    onProgress={this.onProgressYoutube}
                  />
                </YoutubeStyle>
                <VideoInfoStyle>
                  <div className="basic-info">
                    <Header>
                      <h1>{titleVi}</h1>
                    </Header>
                    <div className="views-social">
                      <YoutubeViews originId={originId} />
                      <div>
                        <FacebookShareButton
                          className="fb-share-button"
                          url={`http://danni.tv/watch?id=${id}`}
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
                    {audio.length > 0 && audio[audio.length - 1].author && (
                      <Header>
                        <h3>Người đọc: {audio[audio.length - 1].author}</h3>
                      </Header>
                    )}
                    {descriptionVi && (
                      <div className="description">{descriptionVi}</div>
                    )}
                  </Segment>
                </VideoInfoStyle>
                {audio.length !== 0 && (
                  <FilePlayer
                    onProgress={({ playedSeconds }) =>
                      this.setState({ playedFilePlayer: playedSeconds })
                    }
                    ref={this.refFilePlayer}
                    url={audio[audio.length - 1].source}
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

export default withRouter(Watch);
export { VIDEO_QUERY };
