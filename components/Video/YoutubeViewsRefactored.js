import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Loader, Popup, Statistic } from 'semantic-ui-react';
import youtube from '../../lib/youtube';

const YoutubeViews = ({ originId }) => {
  const [youtubeViews, setYoutubeViews] = useState('');

  const fetchYoutubeViews = async id => {
    const res = await youtube.get('/videos', {
      params: {
        id,
        part: 'statistics',
        key: process.env.YOUTUBE_API_KEY,
      },
    });
    setYoutubeViews(
      parseInt(res.data.items[0].statistics.viewCount, 10).toLocaleString()
    );
  };

  useEffect(() => {
    fetchYoutubeViews(originId);
  }, [originId]);

  return (
    <div>
      <Popup
        wide
        hoverable
        trigger={
          <Statistic size="mini" horizontal>
            <Statistic.Value>
              {youtubeViews || <Loader active inline />}
            </Statistic.Value>
            <Statistic.Label>lượt xem</Statistic.Label>
          </Statistic>
        }
        content={
          <>
            Nguồn:{' '}
            <a href={`https://www.youtube.com/watch?v=${originId}`}>
              www.youtube.com/watch?v={originId}
            </a>
          </>
        }
      />
    </div>
  );
};

YoutubeViews.propTypes = {
  originId: PropTypes.string.isRequired,
};

export default YoutubeViews;
