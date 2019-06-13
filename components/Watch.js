import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import PropTypes from 'prop-types';
// import YouTubePlayer from 'react-player/lib/players/YouTube';
// import FilePlayer from 'react-player/lib/players/FilePlayer';
import ReactPlayer from 'react-player';
import { isMobile } from 'react-device-detect';
import styled from 'styled-components';
import { Segment, Header } from 'semantic-ui-react';
import Error from './ErrorMessage';
import { ALL_VIDEOS_QUERY } from './Videos';

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
      }
      tags {
        text
      }
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

const ShareButton = styled.div`
  margin-top: 10px;
  .fb-share-button {
    float: right;
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
    router: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (window.FB) {
      FB.XFBML.parse(document.getElementById('fb'));
    }
    // Load Facebook JavaScript SDK
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'facebook-jssdk');
  }

  componentDidUpdate() {
    FB.XFBML.parse(document.getElementById('fb'));
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
                      <ReactPlayer
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
                    <ShareButton id="fb">
                      <div
                        className="fb-share-button"
                        data-href={`http://danni.tv/watch?id=${id}`}
                        data-layout="button_count"
                        data-size="large"
                      />
                    </ShareButton>
                    <Header>
                      <h2>{titleVi}</h2>
                    </Header>
                    <Segment>
                      <Header>
                        <h4>Tác giả: {originAuthor}</h4>
                      </Header>
                      {descriptionVi && <div>{descriptionVi}</div>}
                    </Segment>
                    {audio.length !== 0 && (
                      <ReactPlayer
                        onProgress={({ playedSeconds }) =>
                          this.setState({ playedFilePlayer: playedSeconds })
                        }
                        ref={this.refFilePlayer}
                        url={audio[audio.length - 1].source}
                        playing={playingFilePlayer}
                        height="100%"
                        width="100%"
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
                      if (password !== 'dracarys') {
                        alert('Wrong password');
                      } else if (
                        confirm('Are you sure you want to delete this video?')
                      ) {
                        const res = await deleteVideo({
                          variables: { id, password },
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
                  <button
                    type="submit"
                    onClick={async () => {
                      if (password !== 'dracarys') {
                        alert('Wrong password');
                      } else {
                        Router.push({
                          pathname: '/edit',
                          query: { id, password },
                        });
                      }
                    }}
                  >
                    Edit
                  </button>
                </>
              );
            }}
          </Query>
        )}
      </Mutation>
    );
  }
}

export default withRouter(Watch);
export { VIDEO_QUERY };
