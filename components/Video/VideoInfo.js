import { useState, useEffect, useRef } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Segment, Header, Image, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import YoutubeViews from './YoutubeViews';
import VideoDeleteButton from './VideoDeleteButton';
import VideoInfoStyles from '../styles/VideoInfoStyles';

import {
  useCurrentUserQuery,
  useLocalStateQuery,
} from '../Authentication/authHooks';

const VideoInfo = ({
  video: {
    audio,
    originTitle,
    originId,
    originAuthor,
    addedBy,
    originDescription,
  },
  url,
  showFullDescription,
  toggleFullDescription,
  id,
  audioId,
}) => {
  const [descriptionOverflow, setDescriptionOverflow] = useState(false);

  const { currentUser } = useCurrentUserQuery();
  const { contentLanguage } = useLocalStateQuery();
  const descriptionDiv = useRef(null);

  const isDescriptionOverflow = () => {
    if (descriptionDiv.current) {
      const {
        current: { scrollHeight, clientHeight, scrollWidth, clientWidth },
      } = descriptionDiv;
      setDescriptionOverflow(
        scrollHeight > clientHeight || scrollWidth > clientWidth
      );
    }
  };

  const query = { id };
  const title = audio[0] ? audio[0].title : originTitle;
  if (audioId) query.audioId = audioId;

  const isVideoOwner = currentUser && currentUser.id === addedBy.id && !audioId;
  let isAudioOwner = false;
  if (audioId) {
    const videoAudio = audio.filter(vidAud => vidAud.id === audioId)[0];
    isAudioOwner = currentUser && currentUser.id === videoAudio.author.id;
  }

  useEffect(() => {
    isDescriptionOverflow();
  }, [id, audioId]);

  return (
    <VideoInfoStyles>
      <div className="basic-info">
        <Header>
          <h1>{title}</h1>
        </Header>
        {(isAudioOwner || isVideoOwner) && (
          <div className="buttons">
            <>
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
                id={id}
                audioId={audioId}
                title={title}
                userId={currentUser.id}
                contentLanguage={contentLanguage}
                redirect
              />
            </>
          </div>
        )}
        <div className="views-social">
          <YoutubeViews originId={originId} />
          <div>
            <FacebookShareButton className="fb-share-button" url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          </div>
        </div>
      </div>
      <Segment>
        <Header>
          <h2>Tác giả: {originAuthor}</h2>
        </Header>
        {(audio[0] && (
          <Header>
            <h3>
              <Link
                href={{
                  pathname: '/user',
                  query: { id: audio[0].author.id },
                }}
              >
                <a>
                  <Image avatar src={audio[0].author.avatar} />
                  {audio[0].author
                    ? audio[0].author.displayName
                    : 'deleted user'}
                </a>
              </Link>
            </h3>
          </Header>
        )) || (
          <Header>
            <h3>
              <Link
                href={{
                  pathname: '/user',
                  query: { id: addedBy.id },
                }}
              >
                <a>
                  <Image avatar src={addedBy.avatar} />
                  {addedBy ? addedBy.displayName : 'deleted user'}
                </a>
              </Link>
            </h3>
          </Header>
        )}
        <div
          ref={descriptionDiv}
          className={
            showFullDescription
              ? 'description'
              : `description description-preview`
          }
        >
          {(audio[0] && audio[0].description && <>{audio[0].description}</>) ||
            (originDescription && <>{originDescription}</>)}
        </div>
        {descriptionOverflow && (
          <button
            type="button"
            onClick={() => toggleFullDescription()}
            className="ui button"
          >
            {showFullDescription ? 'Đóng' : 'Tiếp'}
          </button>
        )}
      </Segment>
    </VideoInfoStyles>
  );
};

VideoInfo.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  video: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  showFullDescription: PropTypes.bool.isRequired,
  toggleFullDescription: PropTypes.func.isRequired,
};

VideoInfo.defaultProps = {
  audioId: undefined,
};

export default VideoInfo;