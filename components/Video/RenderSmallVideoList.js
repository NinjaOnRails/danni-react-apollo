import { List, Image, Loader } from 'semantic-ui-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import {
  VideoItemStyles,
  ListDescriptionStyled,
  ListHeaderStyled,
  AuthorStyles,
  SmallVideoListStyles,
} from '../styles/SmallVideoListStyles';
import { useCloseFullDescriptionMutation } from '../UI/uiHooks';

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

  const [closeFullDescription] = useCloseFullDescriptionMutation();
  if (audioId) query.audioId = audioId;
  return (
    <List.Item key={audioId || id} onClick={closeFullDescription}>
      <Link
        href={{
          pathname: '/watch',
          query,
        }}
      >
        <a>
          <VideoItemStyles>
            <Image
              src={originThumbnailUrl || originThumbnailUrlSd}
              alt={title}
              label={{
                color: 'black',
                content: displayDuration,
              }}
            />
            <List.Content>
              <ListHeaderStyled>{title}</ListHeaderStyled>
              <ListDescriptionStyled>{originAuthor}</ListDescriptionStyled>
            </List.Content>
          </VideoItemStyles>
        </a>
      </Link>
      <AuthorStyles>
        <Link href={{ pathname: '/user', query: { id: author.id } }}>
          <a className="author">
            <Image avatar src={author.avatar} />
            {author ? author.displayName : 'deleted user'}
          </a>
        </Link>
      </AuthorStyles>
    </List.Item>
  );
};

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const RenderSmallVideoList = ({ dataVideos, id, audioId, fetchMore }) => {
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
              const displayDuration = formatDuration(duration);
              if (audio.length === 0 && videoId !== id) {
                return renderVideoItem(
                  videoId,
                  originThumbnailUrl,
                  originThumbnailUrlSd,
                  originTitle,
                  displayDuration,
                  originAuthor,
                  addedBy
                );
              }
              return audio.map(el => {
                if (audioId !== el.id) {
                  if (el.customThumbnail)
                    originThumbnailUrl = el.customThumbnail;
                  return renderVideoItem(
                    videoId,
                    originThumbnailUrl,
                    originThumbnailUrlSd,
                    el.title,
                    displayDuration,
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
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
