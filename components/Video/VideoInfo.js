import React, { Component } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import {
  Segment,
  Header,
  Image,
  Button,
  Icon,
  Loader,
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
import { DELETE_AUDVID_MUTATION } from '../../graphql/mutation';
import { CURRENT_USER_QUERY, ALL_VIDEOS_QUERY } from '../../graphql/query';
import Error from '../UI/ErrorMessage';

/* eslint-disable */
const deleteAudVidMutation = ({
  contentLanguageQuery: { contentLanguage },
  render,
}) => (
  /* eslint-enable */
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

const Composed = adopt({
  user,
  contentLanguageQuery,
  deleteAudVidMutation,
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
      <Composed>
        {({
          user: { currentUser },
          deleteAudVidMutation: {
            deleteAudVid,
            deleteAudVidResult: { loading, error },
          },
        }) => {
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
  video: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  showFullDescription: PropTypes.bool.isRequired,
  toggleFullDescription: PropTypes.func.isRequired,
};

VideoInfo.defaultProps = {
  audioId: undefined,
};
