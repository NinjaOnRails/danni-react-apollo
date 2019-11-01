import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loader, Popup, Statistic } from 'semantic-ui-react';
import youtube from '../../lib/youtube';

export default class YoutubeViews extends Component {
  state = {
    youtubeViews: '',
  };

  componentDidMount() {
    this.fetchYoutubeViews(this.props.originId);
  }

  componentDidUpdate(prevProps) {
    const { originId } = this.props;
    if (prevProps.originId !== originId) this.fetchYoutubeViews(originId);
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
    return (
      <div>
        <Popup
          wide
          hoverable
          trigger={
            <Statistic size="mini" horizontal>
              <Statistic.Value>
                {this.state.youtubeViews || <Loader active inline />}
              </Statistic.Value>
              <Statistic.Label>lượt xem</Statistic.Label>
            </Statistic>
          }
          content={
            <>
              Nguồn:{' '}
              <a
                href={`https://www.youtube.com/watch?v=${this.props.originId}`}
              >
                www.youtube.com/watch?v={this.props.originId}
              </a>
            </>
          }
        />
      </div>
    );
  }
}

YoutubeViews.propTypes = {
  originId: PropTypes.string.isRequired,
};
