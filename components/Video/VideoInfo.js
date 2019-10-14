import React, { Component } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Segment, Header, Image } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import YoutubeViews from './YoutubeViews';

const VideoInfoStyles = styled.div`
  margin-bottom: 2rem;
  line-height: 2rem;
  h1,
  h2,
  h3,
  .description {
    font-family: ${props => props.theme.font};
    word-break: break-word;
  }
  .fb-share-button {
    float: right;
    cursor: pointer;
  }
  .basic-info {
    margin-top: 10px;
  }
  .views-social {
    display: flex;
    justify-content: space-between;
  }
  .description-preview {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* Show only first 2 lines */
    /* Implement for browsers with no support for webkit */
    max-height: 2rem; /* This is line height X no. of lines to show */
  }
`;

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
    } = this.props;

    const { descriptionOverflow } = this.state;

    return (
      <VideoInfoStyles>
        <div className="basic-info">
          <Header>
            <h1>{audio[0] ? audio[0].title : originTitle}</h1>
          </Header>
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
