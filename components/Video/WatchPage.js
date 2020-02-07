import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Container, Loader } from 'semantic-ui-react';
import SmallVideoList from './SmallVideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import Watch from './Watch';
import { WatchPageStyles } from '../styles/WatchStyles';
import { VIDEO_QUERY } from '../../graphql/query';

class WatchPage extends Component {
  randomNumber = max => {
    if (max === 0 || max === 1) {
      return 0;
    }
    return Math.floor(Math.random() * Math.floor(max - 1));
  };

  randomizeNextVideo = videos => {
    const { id } = this.props;
    const max = videos.length;
    let nextVideo = { id };
    let nextAudio;
    while (nextVideo.id === id) {
      const randomVideoIndex = this.randomNumber(max);
      const randomAudioIndex = this.randomNumber(
        videos[randomVideoIndex].node.audio.length
      );
      nextVideo = videos[randomVideoIndex].node;
      nextAudio = nextVideo.audio[randomAudioIndex];
    }
    return {
      id: nextVideo.id,
      audioId: nextAudio && nextAudio.id,
      title: (nextAudio && nextAudio.title) || nextVideo.originTitle,
      thumbnail:
        (nextAudio && nextAudio.customThumbnail) ||
        nextVideo.originThumbnailUrl,
    };
  };

  render() {
    const {
      id,
      asPath,
      payload: { error, loading, data },
      client,
      audioId,
      videos,
    } = this.props;
    const url = `https://www.danni.tv${asPath}
    `;
    if (error) return <Error error={error} />;
    if (loading) return <Loader active inline="centered" />;
    const { video: initialVideoData } = data;
    if (!initialVideoData) return <p>No Video Found for ID: {id}</p>;
    const currentWatchingLanguage = initialVideoData.audio[0]
      ? initialVideoData.audio[0].language
      : initialVideoData.language;
    return (
      <Query query={VIDEO_QUERY} variables={{ id, audioId }}>
        {payload => {
          if (payload.error) return <Error error={error} />;
          if (payload.loading) return <Loader active inline="centered" />;
          const { video } = payload.data;
          return (
            <>
              <VideoHeader video={video || initialVideoData} url={url} />
              <WatchPageStyles>
                <div className="main">
                  <Watch
                    video={video || initialVideoData}
                    id={id}
                    audioId={audioId}
                    nextVideo={this.randomizeNextVideo(
                      videos.data.videosConnection.edges
                    )}
                  />
                  <Container fluid className="tablet-padding">
                    <VideoInfo
                      {...this.props}
                      video={video || initialVideoData}
                      url={url}
                    />
                    <CommentSection
                      videoId={id}
                      videoLanguage={
                        (video && video.language) || initialVideoData.language
                      }
                      client={client}
                    />
                  </Container>
                </div>
                <div className="list tablet-padding">
                  <SmallVideoList
                    {...this.props}
                    currentWatchingLanguage={currentWatchingLanguage}
                  />
                </div>
              </WatchPageStyles>
            </>
          );
        }}
      </Query>
    );
  }
}

WatchPage.propTypes = {
  id: PropTypes.string.isRequired,
  asPath: PropTypes.string.isRequired,
  payload: PropTypes.object.isRequired,
  audioId: PropTypes.string,
  client: PropTypes.object.isRequired,
};

WatchPage.defaultProps = {
  audioId: null,
};

export default WatchPage;
