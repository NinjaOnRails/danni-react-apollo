import PropTypes from 'prop-types';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Link from 'next/link';
import VideoDeleteButton from './VideoDeleteButton';

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const RenderVideos = ({
  dataAudios,
  dataVideos,
  hideAuthor,
  currentUser,
  deleteAudVid,
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
          const displayDuration = formatDuration(duration);
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
          const displayDuration = formatDuration(duration);
          if (audio.length === 0) {
            return renderVideoItem(
              id,
              originThumbnailUrl,
              originThumbnailUrlSd,
              originTitle,
              displayDuration,
              originAuthor,
              addedBy
            );
          }
          return null;
        }
      )}
    </>
  );
};

RenderVideos.propTypes = {
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
  deleteAudVid: PropTypes.func,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderVideos.defaultProps = {
  deleteAudVid: null,
  hideAuthor: false,
  currentUser: null,
};

export default RenderVideos;
