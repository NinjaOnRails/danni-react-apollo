import React, { Component } from 'react';
import PropTypes from 'prop-types';
import youtube from '../lib/youtube';

export default class YoutubeViews extends Component {
  state = {
    youtubeViews: '',
  };

  componentDidMount() {
    this.fetchYoutubeViews(this.props.originId);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.originId !== this.props.originId)
      this.fetchYoutubeViews(this.props.originId);
  }

  fetchYoutubeViews = async id => {
    const res = await youtube.get('/videos', {
      params: {
        id,
        part: 'statistics',
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    this.setState({
      youtubeViews: parseInt(
        res.data.items[0].statistics.viewCount,
        10
      ).toLocaleString(),
    });
  };

  render() {
    return <div>{this.state.youtubeViews} lượt xem</div>;
  }
}

YoutubeViews.propTypes = {
  originId: PropTypes.string.isRequired,
};
