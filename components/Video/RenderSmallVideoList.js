import { List, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { SmallVideoListStyles } from '../styles/SmallVideoListStyles';
import SmallVideoItem from './SmallVideoItem';

const renderVideoItem = (
  onVideoItemClick,
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
  <SmallVideoItem
    key={audioId || id}
    onVideoItemClick={onVideoItemClick}
    id={id}
    thumbnail={originThumbnailUrl}
    originThumbnailUrlSd={originThumbnailUrlSd}
    duration={displayDuration}
    originAuthor={originAuthor}
    title={title}
    author={author}
    query={query}
  />
);

const RenderSmallVideoList = ({
  dataVideos,
  id,
  audioId,
  onVideoItemClick,
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
      <SmallVideoListStyles>
        <List divided relaxed>
          {dataVideos.videosConnection.edges.map(
            ({
              node: {
                audio,
                originTitle,
                addedBy,
                id: videoId,
                originThumbnailUrl,
                originThumbnailUrlSd,
                originAuthor,
                duration,
              },
            }) => {
              if (audio.length === 0 && videoId !== id) {
                const query = {
                  id: videoId,
                };
                return renderVideoItem(
                  onVideoItemClick,
                  videoId,
                  originThumbnailUrl,
                  originThumbnailUrlSd,
                  originTitle,
                  duration,
                  originAuthor,
                  addedBy,
                  query
                );
                // return (
                //   <SmallVideoItem
                //     key={videoId}
                //     onVideoItemClick={onVideoItemClick}
                //     id={videoId}
                //     thumbnail={originThumbnailUrl}
                //     originThumbnailUrlSd={originThumbnailUrlSd}
                //     duration={duration}
                //     originAuthor={originAuthor}
                //     title={originTitle}
                //     author={addedBy}
                //     query={query}
                //   />
                // );
              }
              return audio.map(el => {
                if (audioId !== el.id) {
                  const query = {
                    id: videoId,
                    audioId: el.id,
                  };
                  return renderVideoItem(
                    onVideoItemClick,
                    videoId,
                    el.customThumbnail || originThumbnailUrl,
                    originThumbnailUrlSd,
                    el.title,
                    duration,
                    originAuthor,
                    el.author,
                    query,
                    el.id
                  );
                  // return (
                  //   <SmallVideoItem
                  //     key={vidAudioId}
                  //     onVideoItemClick={onVideoItemClick}
                  //     id={videoId}
                  //     thumbnail={customThumbnail || originThumbnailUrl}
                  //     originThumbnailUrlSd={originThumbnailUrlSd}
                  //     duration={duration}
                  //     originAuthor={originAuthor}
                  //     title={title}
                  //     author={author}
                  //     audioId={vidAudioId}
                  //     query={query}
                  //   />
                  // );
                }
                return null;
              });
            }
          )}
        </List>
      </SmallVideoListStyles>
    </InfiniteScroll>
  );
};

RenderSmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
