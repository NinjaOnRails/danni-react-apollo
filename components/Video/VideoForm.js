import React, { Component } from 'react';
import { Form, Button, Icon, Loader } from 'semantic-ui-react';
import YouTubePlayer from 'react-player/lib/players/YouTube';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { flagOptions } from '../../lib/supportedLanguages';
import youtube from '../../lib/youtube';
import isYouTubeSource, { youtubeIdLength } from '../../lib/isYouTubeSource';
import Error from '../UI/ErrorMessage';

const YouTubePlayerStyles = styled.div`
  position: relative;
  padding-top: 56.25% /* Player ratio: 100 / (1280 / 720) */;
  margin: 20px;

  .react-player {
    position: absolute;
    top: 0;
    left: 0;
  }
`;

export default class VideoForm extends Component {
  state = {
    fetchingYoutube: false,
    error: null,
  };

  handleChange = (e, { name, value }) => {
    const { setAddVideoState } = this.props;
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
      if (value.length >= 11) this.onSourceFill(value);
    }
  };

  onSourceFill = source => {
    // Check if source is YouTube, extract ID from it and fetch data
    const isYouTube = isYouTubeSource(source);
    let originId;
    if (isYouTube) {
      const { length } = isYouTube;
      originId = source.slice(length, length + youtubeIdLength);
    } else if (source.length === youtubeIdLength) {
      originId = source;
    } else {
      return this.setState({
        error: { message: 'Thông tin không hợp lệ' },
      });
    }

    return this.fetchYoutube(originId);
  };

  fetchYoutube = async id => {
    const { setAddVideoState } = this.props;
    // Fetch data from Youtube for info preview
    try {
      this.setState({ fetchingYoutube: true });
      const res = await youtube.get('/videos', {
        params: {
          id,
          part: 'snippet',
          key: process.env.YOUTUBE_API_KEY,
        },
      });
      this.setState({ fetchingYoutube: false, error: null });
      setAddVideoState({
        originTags: res.data.items[0].snippet.tags,
        youtubeId: id,
      });
    } catch (err) {
      this.setState({
        error: { message: 'Lỗi mạng hoặc sai YouTube ID' },
      });
    }
  };

  onButtonClick = () => {
    const { videoValid, setAddVideoState } = this.props;
    if (videoValid) {
      setAddVideoState({ activeStep: 'audio', videoValid: false });
    } else {
      this.setState({
        error: { message: 'Phải có YouTube Video hợp lệ để tiếp tục' },
      });
    }
  };

  render() {
    const {
      language,
      youtubeId,
      source,
      setAddVideoState,
      videoValid,
    } = this.props;
    const { fetchingYoutube, error } = this.state;

    return (
      <>
        <Form.Dropdown
          label="Ngôn ngữ thuyết minh"
          selection
          options={flagOptions}
          onChange={this.handleChange}
          value={language}
          name="language"
        />
        <Form.Input
          label="YouTube link hoặc ID"
          placeholder="youtube.com/watch?v=36A5bOSP334 hoặc 36A5bOSP334"
          value={source}
          onChange={this.handleChange}
          name="source"
        />
        <Loader
          active={fetchingYoutube || (Boolean(youtubeId) && !videoValid)}
        />
        {youtubeId && (
          <YouTubePlayerStyles>
            <YouTubePlayer
              url={`https://www.youtube.com/embed/${source}`}
              controls
              width="100%"
              height="100%"
              className="react-player"
              onReady={() => setAddVideoState({ videoValid: true })}
            />
          </YouTubePlayerStyles>
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
            onClick={() => this.onButtonClick()}
          >
            Tiếp tục
            <Icon name="right arrow" />
          </Button>
        </div>
      </>
    );
  }
}

VideoForm.propTypes = {
  language: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  youtubeId: PropTypes.string.isRequired,
  videoValid: PropTypes.bool.isRequired,
  setAddVideoState: PropTypes.func.isRequired,
};
