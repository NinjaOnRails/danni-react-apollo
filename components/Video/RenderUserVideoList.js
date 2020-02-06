import PropTypes from 'prop-types';
import VideoItem from './VideoItem';
import { useLocalStateQuery } from '../Authentication/authHooks';

const RenderUserVideoList = ({ 
  dataVideos, 
  hideAuthor, 
  currentUser,
 }) => {
  const { contentLanguage } = useLocalStateQuery();

  const renderVideoItem = (
    id,
    originThumbnailUrl,
    originThumbnailUrlSd,
    title,
    displayDuration,
    originAuthor,
    author,
    query,
    audioId = null
  ) => (
    <VideoItem
      key={audioId || id}
      id={id}
      thumbnail={originThumbnailUrl}
      originThumbnailUrlSd={originThumbnailUrlSd}
      title={title}
      duration={displayDuration}
      originAuthor={originAuthor}
      author={author}
      hideAuthor={hideAuthor}
      currentUser={currentUser}
      query={query}
      contentLanguage={contentLanguage}
    />
  );

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
            return renderVideoItem(
              id,
              originThumbnailUrl,
              originThumbnailUrlSd,
              originTitle,
              duration,
              originAuthor,
              addedBy,
              { id }
            );
          }
          return audio.map(
            ({ title, id: audioId, author, customThumbnail }) => {
              const thumbnail = customThumbnail || originThumbnailUrl;

              return renderVideoItem(
                id,
                thumbnail,
                originThumbnailUrlSd,
                title,
                duration,
                originAuthor,
                author,
                { id, audioId },
                audioId
              );
            }
          );
          // return audio.map(
          //   ({ title, id: audioId, author, customThumbnail }) => {
          //     const query = {
          //       id,
          //       audioId,
          //     };
          //     return (
          //       <VideoItem
          //         key={audioId}
          //         id={id}
          //         audioId={audioId}
          //         thumbnail={customThumbnail || originThumbnailUrl}
          //         originThumbnailUrlSd={originThumbnailUrlSd}
          //         title={title}
          //         duration={duration}
          //         originAuthor={originAuthor}
          //         author={author}
          //         hideAuthor={hideAuthor}
          //         currentUser={currentUser}
          //         query={query}
          //         contentLanguage={contentLanguage}
          //       />
          //     );
          //   }
          // );
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
