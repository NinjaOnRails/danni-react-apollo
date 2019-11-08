import { List, Image } from 'semantic-ui-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  VideoItemStyles,
  ListDescriptionStyled,
  ListHeaderStyled,
  AuthorStyles,
  SmallVideoListStyles,
} from '../styles/SmallVideoListStyles';

const renderVideoItem = (
  onVideoItemClick,
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
    <List.Item key={audioId || id} onClick={() => onVideoItemClick()}>
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

const RenderSmallVideoList = ({
  dataVideos: { videos },
  id,
  audioId,
  onVideoItemClick,
}) => {
  return (
    <SmallVideoListStyles>
      <List divided relaxed>
        {videos.map(
          ({
            audio,
            originTitle,
            addedBy,
            id: videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          }) => {
            const displayDuration = formatDuration(duration);
            if (audio.length === 0 && videoId !== id) {
              return renderVideoItem(
                onVideoItemClick,
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
                return renderVideoItem(
                  onVideoItemClick,
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
  );
};

RenderSmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
