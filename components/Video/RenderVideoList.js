import { Fragment } from 'react';
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
  const renderVideoItem = (
    id,
    originThumbnailUrl,
    originThumbnailUrlSd,
    title,
    displayDuration,
    originAuthor,
    author,
    audioId = null
  ) => {
    const query = {
      id,
    };
    if (audioId) query.audioId = audioId;

    return (
      <VideoItem
        key={id}
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
      />
    );
  };

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
              language,
            },
          }) => (
            <Fragment key={id}>
              {language &&
                renderVideoItem(
                  id,
                  originThumbnailUrl,
                  originThumbnailUrlSd,
                  originTitle,
                  duration,
                  originAuthor,
                  addedBy
                )}
              {audio.length !== 0 &&
                audio.map(({ title, id: audioId, author, customThumbnail }) => {
                  return renderVideoItem(
                    id,
                    customThumbnail || originThumbnailUrl,
                    originThumbnailUrlSd,
                    title,
                    duration,
                    originAuthor,
                    author,
                    audioId
                  );
                })}
            </Fragment>
          )
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
