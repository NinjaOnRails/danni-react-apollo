import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import FilePlayer from 'react-player/lib/players/FilePlayer';
import { Container, Loader } from 'semantic-ui-react';
import SmallVideoList from './SmallVideoList';
import CommentSection from '../Comment/CommentSection';
import VideoInfo from './VideoInfo';
import VideoHeader from './VideoHeader';
import Error from '../UI/ErrorMessage';
import { WatchPageStyles, YoutubeStyle } from '../styles/WatchStyles';
import {
  trackPlayStart,
  trackPlayFinish,
  trackPlayedDuration,
} from '../../lib/mixpanel';

// refactor

const Watch = ({
  id,
  audioId,
  asPath,
  payload: { error, loading, data },
  client,
  videos,
}) => {
  const [playingFilePlayer, setPlayingFilePlayer] = useState(false);
  const [playedYoutube, setPlayedYoutube] = useState(0);
  const [playedFilePlayer, setPlayedFilePlayer] = useState(0);
  const [readyYoutube, setReadyYoutube] = useState(false);
  const [playbackRates, setPlaybackRates] = useState([]);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [mixpanelEventsSent, setMixpanelEventsSent] = useState([]);

  const youtubePlayer = useRef(null);
  const filePlayer = useRef(null);

  const url = `https://www.danni.tv${asPath}
  `;
  if (error) return <Error error={error} />;
  if (loading) return <Loader active inline="centered" />;
  const { video } = data;
  if (!video) return <p>No Video Found for ID: {id}</p>;
  const currentWatchingLanguage = video.audio[0]
    ? video.audio[0].language
    : video.language;

  useEffect(() => {
    if (youtubePlayer.current) {
      setPlayedFilePlayer(0);
      setPlayedYoutube(0);
      setReadyYoutube(false);
      // Unmute after auto mute below in case new video opened has no separate audio
      if (readyYoutube) youtubePlayer.current.getInternalPlayer();
      // .unMute();
    }
  }, [id, audioId]);

  const onProgressYoutube = e => {
    const { playedSeconds } = e;

    // Synchronise FilePlayer progress with Youtube player progress within 2 seconds
    // to allow for synchronised seeking
    if (video.audio[0] && youtubePlayer.current) {
      // Auto mute video
      if (!youtubePlayer.current.getInternalPlayer().isMuted()) {
        youtubePlayer.current.getInternalPlayer().mute();
      }
      if (
        playedFilePlayer > 0 &&
        playedYoutube > 0 &&
        playedSeconds !== playedYoutube
      ) {
        if (Math.abs(playedFilePlayer - playedYoutube) > 2) {
          filePlayer.current.seekTo(playedSeconds);
        }
      }
      setPlayedYoutube(playedSeconds);
    }

    // Video Play Mixpanel tracking
    const eventSent = trackPlayedDuration({ e, video, mixpanelEventsSent });
    if (eventSent) {
      setMixpanelEventsSent([...mixpanelEventsSent, eventSent]);
    }
  };

  const onReadyYoutube = () => {
    setReadyYoutube(true);
    if (youtubePlayer.current) {
      setPlaybackRates(
        youtubePlayer.current.getInternalPlayer().getAvailablePlaybackRates()
      );
    }
  };

  const onVideoItemClick = () => {
    // Reset some states on different video click
    setShowFullDescription(false);
    setMixpanelEventsSent([]);
  };

  const toggleFullDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const renderVideoPlayer = () => {
    return (
      <YoutubeStyle onClick={() => setPlayingFilePlayer(!playingFilePlayer)}>
        <YouTubePlayer
          className="youtube-player"
          url={`https://www.youtube.com/embed/${video.originId}`}
          width="100%"
          height="100%"
          onReady={() => onReadyYoutube()}
          playing={playingFilePlayer}
          controls
          onPause={() => setPlayingFilePlayer(false)}
          onPlay={() => setPlayingFilePlayer(true)}
          onProgress={e => onProgressYoutube(e)}
          onStart={() => trackPlayStart(video)}
          onEnded={() => trackPlayFinish(video)}
          ref={youtubePlayer}
          playbackRate={playbackRate}
        />
      </YoutubeStyle>
    );
  };

  const renderFilePlayer = audio => {
    return (
      <FilePlayer
        className="filePlayer"
        config={{
          file: {
            forceAudio: true,
          },
        }}
        onProgress={e => {
          setPlayedFilePlayer(e.playedSeconds);
        }}
        ref={filePlayer}
        url={audio[0].source}
        playing={playingFilePlayer}
        onPause={() => setPlayingFilePlayer(false)}
        height="100%"
        width="100%"
        playbackRate={playbackRate}
      />
    );
  };

  return (
    <>
      <VideoHeader video={video} url={url} />
      <WatchPageStyles>
        <div className="main">
          {renderVideoPlayer(video)}
          <Container fluid className="tablet-padding">
            <VideoInfo
              id={id}
              audioId={audioId}
              video={video}
              url={url}
              showFullDescription={showFullDescription}
              toggleFullDescription={toggleFullDescription}
            />
            {video.audio[0] && readyYoutube && renderFilePlayer(video.audio)}
            <CommentSection
              videoId={id}
              videoLanguage={video.language}
              client={client}
            />
          </Container>
        </div>
        <div className="list tablet-padding">
          <SmallVideoList
            videos={videos}
            currentWatchingLanguage={currentWatchingLanguage}
            onVideoItemClick={() => onVideoItemClick(client)}
            id={id}
            audioId={audioId}
          />
        </div>
      </WatchPageStyles>
    </>
  );
};

Watch.propTypes = {
  id: PropTypes.string.isRequired,
  asPath: PropTypes.string.isRequired,
  payload: PropTypes.object.isRequired,
  audioId: PropTypes.string,
  client: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
};

Watch.defaultProps = {
  audioId: null,
};

export default Watch;
