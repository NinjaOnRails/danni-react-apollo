import { List } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { SmallVideoListStyles } from '../styles/SmallVideoListStyles';
import VideoItem from './VideoItem';

const RenderSmallVideoList = ({
  dataAudios: { audios },
  dataVideos: { videos },
  id,
  audioId,
  onVideoItemClick,
}) => {
  return (
    <SmallVideoListStyles>
      <List divided relaxed>
        {audios.map(({ id, title, author, video }) => {
          const {
            id: videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          } = video;
          if (audioId !== id) {
            return (
              <VideoItem
                key={id || videoId}
                onVideoItemClick={onVideoItemClick}
                id={videoId}
                originThumbnailUrl={originThumbnailUrl}
                originThumbnailUrlSd={originThumbnailUrlSd}
                duration={duration}
                originAuthor={originAuthor}
                title={title}
                author={author}
                audioId={id}
              />
            );
          }
          return null;
        })}
        {videos.map(
          ({
            audio,
            originTitle,
            addedBy,
            id: videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          }) => {
            if (audio.length === 0 && videoId !== id) {
              return (
                <VideoItem
                  key={audio.id || videoId}
                  onVideoItemClick={onVideoItemClick}
                  id={videoId}
                  originThumbnailUrl={originThumbnailUrl}
                  originThumbnailUrlSd={originThumbnailUrlSd}
                  duration={duration}
                  originAuthor={originAuthor}
                  title={originTitle}
                  author={addedBy}
                />
              );
            }
            return null;
          }
        )}
      </List>
    </SmallVideoListStyles>
  );
};

RenderSmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
