import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Container, Loader } from 'semantic-ui-react';
import SmallVideoList from './SmallVideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import Watch from './Watch';
import { WatchPageStyles } from '../styles/WatchStyles';

class WatchPage extends Component {
  state = {
    showFullDescription: false,
  };

  onVideoItemClick = () => {
    this.setState({ showFullDescription: false, mixpanelEventsSent: [] });
  };

  toggleFullDescription = () => {
    const { showFullDescription } = this.state;
    this.setState({ showFullDescription: !showFullDescription });
  };

  render() {
    const {
      id,
      asPath,
      payload: { error, loading, data },
      client,
      audioId,
    } = this.props;
    const { showFullDescription } = this.state;
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
            <Watch video={video} id={id} audioId={audioId} />
            <Container fluid className="tablet-padding">
              <VideoInfo
                {...this.props}
                video={video}
                url={url}
                showFullDescription={showFullDescription}
                toggleFullDescription={this.toggleFullDescription}
              />
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
