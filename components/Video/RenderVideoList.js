import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

const RenderVideoList = ({
  dataAudios,
  dataVideos,
  hideAuthor,
  currentUser,
  deleteAudVid,
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
              originThumbnailUrl={originThumbnailUrl}
              originThumbnailUrlSd={originThumbnailUrlSd}
              title={title}
              duration={duration}
              originAuthor={originAuthor}
              author={author}
              hideAuthor={hideAuthor}
              currentUser={currentUser}
              deleteAudVid={deleteAudVid}
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
                deleteAudVid={deleteAudVid}
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
  deleteAudVid: PropTypes.func,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderVideoList.defaultProps = {
  deleteAudVid: null,
  hideAuthor: false,
  currentUser: null,
};

export default RenderVideoList;
