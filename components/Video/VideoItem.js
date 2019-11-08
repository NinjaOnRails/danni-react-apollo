import { List, Image } from 'semantic-ui-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  VideoItemStyles,
  ListDescriptionStyled,
  ListHeaderStyled,
  AuthorStyles,
} from '../styles/SmallVideoListStyles';
import { formatDuration } from './utils';

const VideoItem = ({
  onVideoItemClick,
  id,
  originThumbnailUrl,
  originThumbnailUrlSd,
  duration,
  originAuthor,
  audioId,
  title,
  author,
}) => {
  const query = {
    id,
  };
  if (audioId) query.audioId = audioId;
  return (
    <List.Item onClick={() => onVideoItemClick()}>
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
                content: formatDuration(duration),
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

VideoItem.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  originThumbnailUrl: PropTypes.string.isRequired,
  originThumbnailUrlSd: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  originAuthor: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
};

VideoItem.defaultProps = {
  audioId: '',
};

export default VideoItem;
