import { List, Image, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import {
  VideoItem,
  ListDescriptionStyled,
  ListHeaderStyled,
} from '../styles/VideoListStyles';

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
          <VideoItem>
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
              <ListDescriptionStyled>
                <Icon name="user" />
                {author ? author.displayName : 'deleted user'}
              </ListDescriptionStyled>
            </List.Content>
          </VideoItem>
        </a>
      </Link>
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
  dataAudios: { audios },
  dataVideos: { videos },
  id,
  audioId,
  onVideoItemClick,
}) => {
  return (
    <List divided relaxed>
      {audios.map(audio => {
        const {
          id: videoId,
          originThumbnailUrl,
          originThumbnailUrlSd,
          originAuthor,
          duration,
        } = audio.video;
        const displayDuration = formatDuration(duration);
        if (audioId !== audio.id) {
          return renderVideoItem(
            onVideoItemClick,
            videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            audio.title,
            displayDuration,
            originAuthor,
            audio.author,
            audio.id
          );
        }
        return null;
      })}
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
          return null;
        }
      )}
    </List>
  );
};

RenderSmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  dataAudios: PropTypes.object.isRequired,
  dataVideos: PropTypes.object.isRequired,
};

RenderSmallVideoList.defaultProps = {
  audioId: '',
};

export default RenderSmallVideoList;
