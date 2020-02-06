import { useState, useEffect, useRef } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import {
  Segment,
  Header,
  Image,
  Button,
  Icon,
  Statistic,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import YoutubeViews from './YoutubeViews';
import VideoDeleteButton from './VideoDeleteButton';
import VideoInfoStyles from '../styles/VideoInfoStyles';
import {
  useCurrentUserQuery,
  useLocalStateQuery,
} from '../Authentication/authHooks';
import { useOpenAuthModalMutation } from '../UI/uiHooks';
import {
  useCreateAudioVoteMutation,
  useCreateVideoVoteMutation,
} from './videoHooks';

const VideoInfo = ({
  video: {
    audio,
    originTitle,
    originId,
    originAuthor,
    addedBy,
    originDescription,
    vote,
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

  const [openAuthModal] = useOpenAuthModalMutation();
  const [createAudioVote] = useCreateAudioVoteMutation({
    id,
    audioId,
    currentUser,
  });
  const [createVideoVote] = useCreateVideoVoteMutation({
    id,
    audioId,
    currentUser,
  });
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

  const onVideoLike = type => {
    if (currentUser) {
      if (!audioId) {
        createVideoVote({
          variables: { video: id, type },
          optimisticResponse: {
            __typename: 'Mutation',
            createVideoVote: {
              id: Math.round(Math.random() * -100000000),
              type,
              user: { id: currentUser.id, __typename: 'User' },
              __typename: 'VideoVote',
            },
          },
        });
      } else {
        createAudioVote({
          variables: { audio: audioId, type },
          optimisticResponse: {
            __typename: 'Mutation',
            createAudioVote: {
              id: Math.round(Math.random() * -100000000),
              type,
              user: { id: currentUser.id, __typename: 'User' },
              __typename: 'AudioVote',
            },
          },
        });
      }
    } else {
      openAuthModal();
    }
  };

  const query = { id };
  const title = audio[0] ? audio[0].title : originTitle;
  if (audioId) query.audioId = audioId;

  useEffect(() => {
    isDescriptionOverflow();
  }, [id, audioId]);

          const watchVotes = audioId ? audio[0].vote : vote;
          let userVoteType = null;
          let upVoteCount = 0;
          let downVoteCount = 0;
          if (watchVotes.length > 0) {
            for (let i = 0; i < watchVotes.length; i ++) {
              watchVotes[i].type === 'UPVOTE' ? upVoteCount++ : downVoteCount++;
            }

            if (currentUser) {
              userVoteType = watchVotes.find(
                  watchVote => watchVote.user.id === currentUser.id
              );
            }
          }
  return (
    <>
      <>
        <>
          {() => (
            <VideoInfoStyles>
              <div className="basic-info">
                <Header>
                  <h1>{title}</h1>
                </Header>
                {currentUser && currentUser.id === addedBy.id && (
                  <div className="buttons">
                    {true && (
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
                    )}
                  </div>
                )}
                <div className="views-social">
                  <div className="vid-statistic">
                    <YoutubeViews originId={originId} />
                    <Statistic size="mini" horizontal>
                      <Statistic.Value>{upVoteCount} </Statistic.Value>
                      <Statistic.Label>
                        <Icon
                          id="UPVOTE"
                          name="thumbs up"
                          link
                          color={
                            userVoteType && userVoteType.type === 'UPVOTE'
                              ? 'green'
                              : 'black'
                          }
                          size="large"
                          onClick={e => onVideoLike(e.target.id)}
                        />
                      </Statistic.Label>
                    </Statistic>
                    <Statistic size="mini" horizontal>
                      <Statistic.Value>{downVoteCount}</Statistic.Value>
                      <Statistic.Label>
                        <Icon
                          id="DOWNVOTE"
                          name="thumbs down"
                          link
                          color={
                            userVoteType && userVoteType.type === 'DOWNVOTE'
                              ? 'red'
                              : 'black'
                          }
                          size="large"
                          onClick={e => onVideoLike(e.target.id)}
                        />
                      </Statistic.Label>
                    </Statistic>
                    {/* <Statistic size="mini" horizontal>
                      <Statistic.Value>
                        {audioId ? audio[0].comment.length : comment.length}
                      </Statistic.Value>
                      <Statistic.Label>
                        <Icon name="comment" size="large" />
                      </Statistic.Label>
                    </Statistic> */}
                  </div>
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
                  {(audio[0] && audio[0].description && (
                    <>{audio[0].description}</>
                  )) ||
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
          )}
        </>
      </>
    </>
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
