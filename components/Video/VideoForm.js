import { useState } from 'react';
import { Form, Button, Icon, Loader } from 'semantic-ui-react';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import PropTypes from 'prop-types';
import { flagOptions } from '../../lib/supportedLanguages';
import youtube from '../../lib/youtube';
import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';
import Error from '../UI/ErrorMessage';

const VideoForm = ({
  language,
  youtubeId,
  source,
  setAddVideoState,
  videoValid,
  editVideo,
}) => {
  const [fetchingYoutube, setFetchingYoutube] = useState(false);
  const [error, setError] = useState(null);

  const fetchYoutube = async id => {
    // Fetch data from Youtube for info preview
    try {
      setFetchingYoutube(true);
      const res = await youtube.get('/videos', {
        params: {
          id,
          part: 'snippet',
          key: process.env.YOUTUBE_API_KEY,
        },
      });
      setFetchingYoutube(false);
      setError(null);
      setAddVideoState({
        originTags: res.data.items[0].snippet.tags,
        youtubeId: id,
      });
    } catch (err) {
      setError({ message: 'Lỗi mạng hoặc sai YouTube ID' });
    }
  };

  const onSourceFill = inputSource => {
    // Check if source is YouTube, extract ID from it and fetch data
    const isYouTube = isYouTubeSource(inputSource);
    let originId;
    if (isYouTube) {
      const { length } = isYouTube;
      originId = inputSource.slice(length, length + youtubeIdLength);
    } else if (inputSource.length === youtubeIdLength) {
      originId = inputSource;
    } else {
      return setError({ message: 'Thông tin không hợp lệ' });
    }
    return fetchYoutube(originId);
  };

  const handleChange = (e, { name, value }) => {
    // Check video source input to refetch preview if necessary
    if (name === 'language') {
      setAddVideoState({ language: value });
    } else {
      setAddVideoState({
        originTags: [],
        youtubeId: '',
        videoValid: false,
        source: value,
      });
      if (value.length >= 11) onSourceFill(value);
    }
  };

  const onButtonClick = () => {
    if (videoValid) {
      setAddVideoState({ activeStep: 'audio', videoValid: false });
    } else {
      setError({ message: 'Phải có YouTube Video hợp lệ để tiếp tục' });
    }
  };

  return (
    <>
      <Form.Dropdown
        label="Ngôn ngữ thuyết minh"
        selection
        options={flagOptions}
        onChange={handleChange}
        defaultValue={language}
        name="language"
      />
      <Form.Input
        label="YouTube ID hoặc đường link (URL)  "
        placeholder="36A5bOSP334 hoặc www.youtube.com/watch?v=36A5bOSP334"
        defaultValue={source}
        onChange={handleChange}
        name="source"
      />
      <Loader active={fetchingYoutube || (Boolean(youtubeId) && !videoValid)} />
      {(youtubeId || (editVideo && source)) && (
        <div className="youtube-player">
          <YouTubePlayer
            url={`https://www.youtube.com/embed/${source}`}
            controls
            width="100%"
            height="100%"
            className="react-player"
            onReady={() => setAddVideoState({ videoValid: true })}
          />
        </div>
      )}
      <Error error={error} />
      <div className="buttons">
        <Button
          size="big"
          disabled={fetchingYoutube || (Boolean(youtubeId) && !videoValid)}
          type="button"
          icon
          labelPosition="right"
          primary
          onClick={onButtonClick}
        >
          Tiếp tục
          <Icon name="right arrow" />
        </Button>
      </div>
    </>
  );
};

VideoForm.propTypes = {
  language: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  videoValid: PropTypes.bool.isRequired,
  setAddVideoState: PropTypes.func.isRequired,
  editVideo: PropTypes.bool,
};

VideoForm.defaultProps = {
  editVideo: false,
};

export default VideoForm;
