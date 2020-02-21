import PropTypes from 'prop-types';
import { Container, Loader } from 'semantic-ui-react';
import SmallVideoList from './SmallVideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import Watch from './Watch';
import { WatchPageStyles } from '../styles/WatchStyles';
import { useVideoQuery } from './videoHooks';
import { randomNumber } from './utils';

const WatchPage = ({
  id,
  asPath,
  payload: { error, loading, data },
  client,
  audioId,
  videos,
}) => {
  const payload = useVideoQuery({ id, audioId });

  if (error) return <Error error={error} />;
  if (loading) return <Loader active inline="centered" />;
  const { video: initialVideoData } = data;
  if (!initialVideoData) return <p>No Video Found for ID: {id}</p>;
  const currentWatchingLanguage = initialVideoData.audio[0]
    ? initialVideoData.audio[0].language
    : initialVideoData.language;

  if (payload.error) return <Error error={error} />;
  if (payload.loading) return <Loader active inline="centered" />;
  const { video } = payload.data;
  const url = `https://www.danni.tv${asPath}`;

  const randomizeNextVideo = () => {
    const loadedVideos = videos.data.videosConnection.edges;

    const max = loadedVideos.length;
    let nextVideo = { id };
    let nextAudio;
    while (nextVideo.id === id) {
      const randomVideoIndex = randomNumber(max);
      const randomAudioIndex = randomNumber(
        loadedVideos[randomVideoIndex].node.audio.length
      );
      nextVideo = loadedVideos[randomVideoIndex].node;
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

  return (
    <>
      <VideoHeader video={video || initialVideoData} url={url} />
      <WatchPageStyles>
        <div className="main">
          <Watch
            video={video || initialVideoData}
            id={id}
            audioId={audioId}
            nextVideo={randomizeNextVideo()}
          />
          <Container fluid className="tablet-padding">
            <VideoInfo
              video={video || initialVideoData}
              url={url}
              id={id}
              audioId={audioId}
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
            id={id}
            audioId={audioId}
            videos={videos}
            currentWatchingLanguage={currentWatchingLanguage}
          />
        </div>
      </WatchPageStyles>
    </>
  );
};

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
