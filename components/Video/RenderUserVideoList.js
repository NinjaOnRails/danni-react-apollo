import PropTypes from 'prop-types';
import VideoItem from './VideoItem';
import { useLocalStateQuery } from '../Authentication/authHooks';

const RenderUserVideoList = ({ dataVideos, hideAuthor, currentUser }) => {
  const { contentLanguage } = useLocalStateQuery();

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
            return (
              <VideoItem
                key={id}
                id={id}
                thumbnail={originThumbnailUrl}
                originThumbnailUrlSd={originThumbnailUrlSd}
                title={originTitle}
                duration={duration}
                originAuthor={originAuthor}
                author={addedBy}
                hideAuthor={hideAuthor}
                currentUser={currentUser}
                query={{ id }}
                contentLanguage={contentLanguage}
              />
            );
          }
          return audio.map(
            ({ title, id: audioId, author, customThumbnail }) => {
              return (
                <VideoItem
                  key={audioId}
                  id={id}
                  audioId={audioId}
                  thumbnail={customThumbnail || originThumbnailUrl}
                  originThumbnailUrlSd={originThumbnailUrlSd}
                  title={title}
                  duration={duration}
                  originAuthor={originAuthor}
                  author={author}
                  hideAuthor={hideAuthor}
                  currentUser={currentUser}
                  query={{ id, audioId }}
                  contentLanguage={contentLanguage}
                />
              );
            }
          );
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
