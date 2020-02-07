import { List, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { useCloseFullDescriptionMutation } from '../UI/uiHooks';
import { SmallVideoListStyles } from '../styles/SmallVideoListStyles';
import SmallVideoItem from './SmallVideoItem';

const RenderSmallVideoList = ({ dataVideos, id, audioId, fetchMore }) => {
  const [closeFullDescription] = useCloseFullDescriptionMutation();

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
                return (
                  <SmallVideoItem
                    key={videoId}
                    closeFullDescription={closeFullDescription}
                    thumbnail={originThumbnailUrl}
                    originThumbnailUrlSd={originThumbnailUrlSd}
                    duration={duration}
                    originAuthor={originAuthor}
                    title={originTitle}
                    author={addedBy}
                    query={{ id: videoId }}
                  />
                );
              }
              return audio.map(el => {
                if (audioId !== el.id) {
                  return (
                    <SmallVideoItem
                      key={el.id}
                      closeFullDescription={closeFullDescription}
                      thumbnail={el.customThumbnail || originThumbnailUrl}
                      originThumbnailUrlSd={originThumbnailUrlSd}
                      duration={duration}
                      originAuthor={originAuthor}
                      title={el.title}
                      author={el.author}
                      query={{ id: videoId, audioId: el.id }}
                    />
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
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
