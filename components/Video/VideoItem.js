import PropTypes from 'prop-types';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import Link from 'next/link';
import VideoDeleteButton from './VideoDeleteButton';
import { formatDuration } from './utils';

const VideoItem = ({
  id,
  originThumbnailUrl,
  originThumbnailUrlSd,
  title,
  duration,
  originAuthor,
  author,
  audioId,
  hideAuthor,
  currentUser,
  deleteAudVid,
  query,
}) => (
  <div>
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
              content: formatDuration(duration),
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

VideoItem.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  originThumbnailUrl: PropTypes.string.isRequired,
  originThumbnailUrlSd: PropTypes.string,
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  originAuthor: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  deleteAudVid: PropTypes.func,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
};

VideoItem.defaultProps = {
  audioId: '',
  deleteAudVid: null,
  hideAuthor: false,
  currentUser: null,
  originThumbnailUrlSd: '',
};

export default VideoItem;
