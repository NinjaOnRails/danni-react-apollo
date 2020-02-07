import Link from 'next/link';
import PropTypes from 'prop-types';
import { List, Image } from 'semantic-ui-react';
import {
  VideoItemStyles,
  ListDescriptionStyled,
  ListHeaderStyled,
  AuthorStyles,
} from '../styles/SmallVideoListStyles';
import { formatDuration } from './utils';

const VideoItem = ({
  closeFullDescription,
  thumbnail,
  originThumbnailUrlSd,
  duration,
  originAuthor,
  title,
  author,
  query,
}) => (
  <List.Item onClick={() => closeFullDescription()}>
    <Link
      href={{
        pathname: '/watch',
        query,
      }}
    >
      <a>
        <VideoItemStyles>
          <Image
            src={thumbnail || originThumbnailUrlSd}
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

VideoItem.propTypes = {
  closeFullDescription: PropTypes.func.isRequired,
  thumbnail: PropTypes.string.isRequired,
  originThumbnailUrlSd: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  originAuthor: PropTypes.string.isRequired,
  author: PropTypes.object.isRequired,
  query: PropTypes.object.isRequired,
};

export default VideoItem;
