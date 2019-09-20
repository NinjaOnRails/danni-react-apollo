import PropTypes from 'prop-types';
import { Card, Icon, Image } from 'semantic-ui-react';
import Link from 'next/link';

const formatDuration = duration => {
  // Convert and format duration
  const seconds = duration % 60;
  return `${Math.round(duration / 60)}:${
    seconds > 9 ? seconds : `0${seconds}`
  }`;
};

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
              <Card.Description>
                <Icon name="user" />
                {author ? author.displayName : 'deleted user'}
              </Card.Description>
            </Card.Content>
          </Card>
        </a>
      </Link>
    </div>
  );
};

const RenderVideos = ({ dataAudios, dataVideos }) => (
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

RenderVideos.propTypes = {
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
};

export default RenderVideos;
