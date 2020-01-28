import React, { Component } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import {
  Segment,
  Header,
  Image,
  Button,
  Icon,
  Loader,
  Statistic,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Link from 'next/link';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import YoutubeViews from './YoutubeViews';
import VideoDeleteButton from './VideoDeleteButton';
import VideoInfoStyles from '../styles/VideoInfoStyles';
import { user, contentLanguageQuery } from '../UI/ContentLanguage';
import {
  DELETE_AUDVID_MUTATION,
  CREATE_VIDEO_VOTE,
  CREATE_AUDIO_VOTE,
} from '../../graphql/mutation';
import {
  CURRENT_USER_QUERY,
  ALL_VIDEOS_QUERY,
  VIDEO_QUERY,
} from '../../graphql/query';
import { openAuthModal } from '../Authentication/PleaseSignIn';
import Error from '../UI/ErrorMessage';

const deleteAudVidMutation = ({
  contentLanguageQuery: { contentLanguage },
  render,
}) => (
  <Mutation
    mutation={DELETE_AUDVID_MUTATION}
    refetchQueries={[
      { query: CURRENT_USER_QUERY },
      { query: ALL_VIDEOS_QUERY, variables: { contentLanguage } },
    ]}
    onCompleted={() => Router.push('/')}
  >
    {(deleteAudVid, deleteAudVidResult) =>
      render({ deleteAudVid, deleteAudVidResult })
    }
  </Mutation>
);

const createAudioVoteMutation = ({
  render,
  id,
  audioId,
  user: { currentUser },
}) => (
  <Mutation
    mutation={CREATE_AUDIO_VOTE}
    // refetchQueries={[{ query: VIDEO_QUERY, variables: { id, audioId } }]}
    update={(proxy, { data: { createAudioVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
      });

      const existingVote =
        data.video.audio[0].vote.length > 0
          ? data.video.audio[0].vote.find(
              audioVote => audioVote.user.id === currentUser.id
            )
          : null;
      if (!existingVote) {
        data.video.audio[0].vote = data.video.audio[0].vote.concat([
          createAudioVote,
        ]);
      } else if (existingVote && existingVote.type !== createAudioVote.type) {
        data.video.audio[0].vote = data.video.audio[0].vote.map(audioVote => {
          if (audioVote.user.id === currentUser.id) {
            audioVote.type = createAudioVote.type;
          }
          return audioVote;
        });
      } else if (existingVote && existingVote.type === createAudioVote.type) {
        data.video.audio[0].vote = data.video.audio[0].vote.filter(
          audioVote => audioVote.user.id !== currentUser.id
        );
      }
      // data.video.audio[0].vote = vote;
      proxy.writeQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
        data,
      });
    }}
  >
    {(createAudioVote, createAudioVoteResult) =>
      render({ createAudioVote, createAudioVoteResult })
    }
  </Mutation>
);

const createVideoVoteMutation = ({
  render,
  id,
  audioId,
  user: { currentUser },
}) => (
  <Mutation
    mutation={CREATE_VIDEO_VOTE}
    // refetchQueries={[{ query: VIDEO_QUERY, variables: { id, audioId } }]}
    update={(proxy, { data: { createVideoVote } }) => {
      // Read the data from our cache for this query.
      const data = proxy.readQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
      });
      const existingVote =
        data.video.vote.length > 0
          ? data.video.vote.find(
              videoVote => videoVote.user.id === currentUser.id
            )
          : null;
      if (!existingVote) {
        data.video.vote = data.video.vote.concat([createVideoVote]);
      } else if (existingVote && existingVote.type !== createVideoVote.type) {
        data.video.vote = data.video.vote.map(videoVote => {
          if (videoVote.user.id === currentUser.id) {
            videoVote.type = createVideoVote.type;
          }
          return videoVote;
        });
      } else if (existingVote && existingVote.type === createVideoVote.type) {
        data.video.vote = data.video.vote.filter(
          videoVote => videoVote.user.id !== currentUser.id
        );
      }
      proxy.writeQuery({
        query: VIDEO_QUERY,
        variables: { id, audioId },
        data,
      });
    }}
  >
    {(createVideoVote, createVideoVoteResult) =>
      render({ createVideoVote, createVideoVoteResult })
    }
  </Mutation>
);
/* eslint-enable */

const Composed = adopt({
  user,
  contentLanguageQuery,
  deleteAudVidMutation,
  createAudioVoteMutation,
  createVideoVoteMutation,
  openAuthModal,
});

export default class VideoInfo extends Component {
  state = {
    descriptionOverflow: false,
  };

  componentDidMount() {
    this.isDescriptionOverflow();
  }

  componentDidUpdate(prevProps) {
    const { id, audioId } = this.props;
    if (id !== prevProps.id || audioId !== prevProps.audioId) {
      this.isDescriptionOverflow();
    }
  }

  onVideoLike({
    createAudioVote,
    createVideoVote,
    type,
    openAuthModal,
    currentUser,
  }) {
    const { id, audioId } = this.props;
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
  }

  isDescriptionOverflow() {
    this.setState({
      descriptionOverflow:
        this.descriptionDiv.scrollHeight > this.descriptionDiv.clientHeight ||
        this.descriptionDiv.scrollWidth > this.descriptionDiv.clientWidth,
    });
  }

  render() {
    const {
      video: {
        audio,
        originTitle,
        originId,
        originAuthor,
        addedBy,
        originDescription,
        vote,
        comment,
      },
      url,
      showFullDescription,
      toggleFullDescription,
      id,
      audioId,
    } = this.props;

    const { descriptionOverflow } = this.state;
    const query = { id };
    const title = audio[0] ? audio[0].title : originTitle;
    if (audioId) query.audioId = audioId;

    return (
      <Composed id={id} audioId={audioId}>
        {({
          user: { currentUser },
          deleteAudVidMutation: {
            deleteAudVid,
            deleteAudVidResult: { loading, error },
          },
          createAudioVoteMutation: { createAudioVote, createAudioVoteResult },
          createVideoVoteMutation: { createVideoVote, createVideoVoteResult },
          openAuthModal,
        }) => {
          const watchVotes = audioId ? audio[0].vote : vote;
          let userVoteType = null;
          let upVoteCount = 0;
          let downVoteCount = 0;
          if (watchVotes.length > 0) {
            // voteCount = watchVotes.reduce((total, watchVote) => {
            //   const i = watchVote.type === 'UPVOTE' ? 1 : -1;
            //   return total + i;
            // }, 0);
            for (let i = 0; i < watchVotes.length; i += 1) {
              watchVotes[i].type === 'UPVOTE' ? upVoteCount++ : downVoteCount++;
            }

            if (currentUser) {
              userVoteType = watchVotes.find(
                watchVote => watchVote.user.id === currentUser.id
              );
            }
          }
          return (
            <VideoInfoStyles>
              <div className="basic-info">
                <Header>
                  <h1>{title}</h1>
                </Header>
                <Error error={error} />
                {currentUser && currentUser.id === addedBy.id && (
                  <div className="buttons">
                    {loading ? (
                      <Loader active inline="centered">
                        Đang xoá video...
                      </Loader>
                    ) : (
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
                          deleteAudVid={deleteAudVid}
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
                          onClick={e =>
                            this.onVideoLike({
                              openAuthModal,
                              createAudioVote,
                              createVideoVote,
                              type: e.target.id,
                              currentUser,
                            })
                          }
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
                          onClick={e =>
                            this.onVideoLike({
                              openAuthModal,
                              createAudioVote,
                              createVideoVote,
                              type: e.target.id,
                              currentUser,
                            })
                          }
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
                  ref={descriptionDiv => {
                    this.descriptionDiv = descriptionDiv;
                  }}
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
          );
        }}
      </Composed>
    );
  }
}

VideoInfo.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  url: PropTypes.string.isRequired,
  showFullDescription: PropTypes.bool.isRequired,
  toggleFullDescription: PropTypes.func.isRequired,
};

VideoInfo.defaultProps = {
  audioId: undefined,
};
