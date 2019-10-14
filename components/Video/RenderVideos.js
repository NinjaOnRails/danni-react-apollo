import PropTypes from 'prop-types';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Link from 'next/link';

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

const renderVideoItem = (
  currentUser,
  hideAuthor,
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
              {hideAuthor && currentUser && currentUser.id === author.id && (
                <Card.Description textAlign="center">
                  <Button icon labelPosition="left">
                    <Icon name="write" />
                    Sửa
                  </Button>
                  <Button icon labelPosition="left" color="red">
                    <Icon name="trash" />
                    Xoá
                  </Button>
                </Card.Description>
              )}
            </Card.Content>
          </Card>
        </a>
      </Link>
      {!hideAuthor && (
        <Link href="user/[id]" as={`user/${author.id}`}>
          <a className="author">
            <Icon name="user" />
            {author ? author.displayName : 'deleted user'}
          </a>
        </Link>
      )}
    </div>
  );
};

const RenderVideos = ({ dataAudios, dataVideos, hideAuthor, currentUser }) => (
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
          currentUser,
          hideAuthor,
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
            currentUser,
            hideAuthor,
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

RenderVideos.propTypes = {
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

RenderVideos.defaultProps = {
  hideAuthor: false,
  currentUser: null,
};

export default RenderVideos;
