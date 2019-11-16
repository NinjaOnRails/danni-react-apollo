import PropTypes from 'prop-types';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Link from 'next/link';
import VideoDeleteButton from './VideoDeleteButton';
import VideoItem from './VideoItem';
import { formatDuration } from './utils';

const RenderUserVideoList = ({ dataVideos, hideAuthor, currentUser }) => {
  return (
    <>
      {dataVideos.videos.map(
        ({
          originThumbnailUrl,
          originThumbnailUrlSd,
          originTitle,
          originAuthor,
          originViewCount,
          id,
          audio,
          duration,
          addedBy,
        }) => {
          if (audio.length === 0) {
            const query = {
              id,
            };
            return (
              <VideoItem
                key={id}
                id={id}
                originThumbnailUrl={originThumbnailUrl}
                originThumbnailUrlSd={originThumbnailUrlSd}
                title={originTitle}
                duration={duration}
                originAuthor={originAuthor}
                author={addedBy}
                hideAuthor={hideAuthor}
                currentUser={currentUser}
                query={query}
              />
            );
          }
          return audio.map(({ title, id: audioId, author }) => {
            const query = {
              id,
              audioId,
            };
            return (
              <VideoItem
                key={audioId}
                id={id}
                audioId={audioId}
                originThumbnailUrl={originThumbnailUrl}
                originThumbnailUrlSd={originThumbnailUrlSd}
                title={title}
                duration={duration}
                originAuthor={originAuthor}
                author={author}
                hideAuthor={hideAuthor}
                currentUser={currentUser}
                query={query}
              />
            );
          });
        }
      )}
    </>
  );
};

RenderUserVideoList.propTypes = {
  dataVideos: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderUserVideoList.defaultProps = {
  hideAuthor: false,
  currentUser: null,
};

export default RenderUserVideoList;
