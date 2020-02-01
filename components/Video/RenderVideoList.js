import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import VideoListStyles from '../styles/VideoListStyles';
import VideoItem from './VideoItem';

const RenderVideoList = ({
  dataVideos,
  hideAuthor,
  currentUser,
  fetchMore,
}) => {
  const loadMore = () =>
    fetchMore({
      variables: {
        cursor: dataVideos.videosConnection.pageInfo.endCursor,
      },
      updateQuery: (
        previousResult,
        {
          fetchMoreResult: {
            videosConnection: { edges, pageInfo, __typename },
          },
        }
      ) =>
        edges.length
          ? {
              // Put the new videos at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              videosConnection: {
                __typename,
                edges: [...previousResult.videosConnection.edges, ...edges],
                pageInfo,
              },
            }
          : previousResult,
    });
  return (
    <InfiniteScroll
      pageStart={0}
      loadMore={loadMore}
      hasMore={dataVideos.videosConnection.pageInfo.hasNextPage}
      // loader={<Loader active inline="centered" key={0} />}
    >
      <VideoListStyles>
        {dataVideos.videosConnection.edges.map(
          ({
            node: {
              originThumbnailUrl,
              originThumbnailUrlSd,
              originTitle,
              originAuthor,
              originViewCount,
              id,
              audio,
              duration,
              addedBy,
            },
          }) => {
            if (audio.length === 0) {
              const query = {
                id,
              };
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
                  query={query}
                />
              );
            }

            return audio.map(({ title, id: audioId, author, customThumbnail }) => {
              const query = {
                id,
                audioId,
              };
              const thumbnail = customThumbnail || originThumbnailUrl;

              return (
                <VideoItem
                  key={audioId}
                  id={id}
                  audioId={audioId}
                  thumbnail={originThumbnailUrl}
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
      </VideoListStyles>
    </InfiniteScroll>
  );
};

RenderVideoList.propTypes = {
  dataVideos: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
  fetchMore: PropTypes.func,
};

RenderVideoList.defaultProps = {
  hideAuthor: false,
  currentUser: null,
  fetchMore: undefined,
};

export default RenderVideoList;
