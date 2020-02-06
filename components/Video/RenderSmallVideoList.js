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
  audioId = null
) => {
  const query = {
    id,
  };
  if (audioId) query.audioId = audioId;
  return (
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
};

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
      loader={<Loader active inline="centered" key={0} />}
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
                return renderVideoItem(
                  onVideoItemClick,
                  videoId,
                  originThumbnailUrl,
                  originThumbnailUrlSd,
                  originTitle,
                  duration,
                  originAuthor,
                  addedBy
                );
              }
              return audio.map(el => {
                if (audioId !== el.id) {
                  return renderVideoItem(
                    onVideoItemClick,
                    videoId,
                    el.customThumbnail || originThumbnailUrl,
                    originThumbnailUrlSd,
                    el.title,
                    duration,
                    originAuthor,
                    el.author,
                    el.id
                  );
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
