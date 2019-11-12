import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

const RenderVideoList = ({
  dataAudios,
  dataVideos,
  hideAuthor,
  currentUser,
}) => {
  return (
    <>
      {dataAudios.audios.map(
        ({
          title,
          id: audioId,
          author,
          video: {
            id,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          },
        }) => {
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
        }
      )}
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
          return null;
        }
      )}
    </>
  );
};

RenderVideoList.propTypes = {
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderVideoList.defaultProps = {
  hideAuthor: false,
  currentUser: null,
};

export default RenderVideoList;
