import PropTypes from 'prop-types';
import { useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import VideoItem from './VideoItem';
import { useLocalStateQuery } from '../Authentication/authHooks';

const RenderUserVideoList = ({ dataVideos, hideAuthor, currentUser }) => {
  const { contentLanguage } = useLocalStateQuery();

  const client = useApolloClient();

  const router = useRouter();

  const clickEditVideo = () => {
    localStorage.setItem('previousPage', router.asPath);
    client.writeData({
      data: { previousPage: router.asPath },
    });
  };

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
                clickEditVideo={clickEditVideo}
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
                  clickEditVideo={clickEditVideo}
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
