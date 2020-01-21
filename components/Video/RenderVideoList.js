import React from 'react';
import PropTypes from 'prop-types';
import { Card, Icon, Image, Button, Loader } from 'semantic-ui-react';
import Link from 'next/link';
import InfiniteScroll from 'react-infinite-scroller';
import VideoDeleteButton from './VideoDeleteButton';
import VideoListStyles from '../styles/VideoListStyles';

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const RenderVideoList = ({
  dataVideos,
  hideAuthor,
  currentUser,
  deleteAudVid,
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
      <div key={audioId || id}>
        <Link
          href={{
            pathname: '/watch',
            query,
          }}
        >
          <a>
            <Card fluid>
              <Image
                fluid
                src={originThumbnailUrl || originThumbnailUrlSd}
                alt={title}
                label={{
                  color: 'black',
                  content: displayDuration,
                  size: 'large',
                }}
              />
              <Card.Content>
                <Card.Header>{title}</Card.Header>
                <Card.Meta>{originAuthor}</Card.Meta>
              </Card.Content>
            </Card>
          </a>
        </Link>
        {!hideAuthor ? (
          <div className="author">
            <Link href={{ pathname: '/user', query: { id: author.id } }}>
              <a>
                <Image avatar src={author.avatar} />
                <span>{author ? author.displayName : 'deleted user'}</span>
              </a>
            </Link>
          </div>
        ) : (
          currentUser &&
          currentUser.id === author.id && (
            <div className="buttons">
              <Link
                href={{
                  pathname: '/edit',
                  query,
                }}
              >
                <Button icon labelPosition="left">
                  <Icon name="write" />
                  Sửa
                </Button>
              </Link>
              <VideoDeleteButton
                deleteAudVid={deleteAudVid}
                id={id}
                audioId={audioId}
                title={title}
              />
            </div>
          )
        )}
      </div>
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
      loader={<Loader active inline="centered" key={0} />}
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
          }) => {
            const displayDuration = formatDuration(duration);
            return (
              <React.Fragment key={id}>
                {language &&
                  renderVideoItem(
                    id,
                    originThumbnailUrl,
                    originThumbnailUrlSd,
                    originTitle,
                    displayDuration,
                    originAuthor,
                    addedBy
                  )}
                {audio.length !== 0 &&
                  audio.map(
                    ({ title, id: audioId, author, customThumbnail }) => {
                      if (customThumbnail) originThumbnailUrl = customThumbnail;
                      return renderVideoItem(
                        id,
                        originThumbnailUrl,
                        originThumbnailUrlSd,
                        title,
                        displayDuration,
                        originAuthor,
                        author,
                        audioId
                      );
                    }
                  )}
              </React.Fragment>
            );
          }
        )}
      </VideoListStyles>
    </InfiniteScroll>
  );
};

RenderVideoList.propTypes = {
  dataVideos: PropTypes.object.isRequired,
  fetchMore: PropTypes.func,
  deleteAudVid: PropTypes.func,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderVideoList.defaultProps = {
  deleteAudVid: null,
  hideAuthor: false,
  currentUser: null,
  fetchMore: undefined,
};

export default RenderVideoList;
