import PropTypes from 'prop-types';
import Link from 'next/link';
import { Card, Icon, Image, Button } from 'semantic-ui-react';
import VideoDeleteButton from './VideoDeleteButton';
import { formatDuration } from './utils';

const VideoItem = ({
  id,
  thumbnail,
  originThumbnailUrlSd,
  title,
  duration,
  originAuthor,
  author,
  audioId,
  hideAuthor,
  currentUser,
  query,
  contentLanguage,
  clickEditVideo,
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
            src={thumbnail || originThumbnailUrlSd}
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
            <Button icon labelPosition="left" onClick={clickEditVideo}>
              <Icon name="write" />
              Update
            </Button>
          </Link>
          <VideoDeleteButton
            id={id}
            audioId={audioId}
            title={title}
            userId={currentUser.id}
            contentLanguage={contentLanguage}
          />
        </div>
      )
    )}
  </div>
);

VideoItem.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  thumbnail: PropTypes.string.isRequired,
  originThumbnailUrlSd: PropTypes.string,
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  originAuthor: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
  contentLanguage: PropTypes.array,
  currentUser: PropTypes.object,
  hideAuthor: PropTypes.bool,
  clickEditVideo: PropTypes.func,
};

VideoItem.defaultProps = {
  audioId: '',
  hideAuthor: false,
  currentUser: null,
  originThumbnailUrlSd: '',
  contentLanguage: [],
  clickEditVideo: null,
};

export default VideoItem;
