import React, { Component } from 'react';
import { FacebookShareButton, FacebookIcon } from 'react-share';
import { Segment, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import YoutubeViews from './YoutubeViews';

const VideoInfoStyle = styled.div`
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
        addedBy: { displayName },
        originDescription,
      },
      url,
      showFullDescription,
      toggleFullDescription,
    } = this.props;

    const { descriptionOverflow } = this.state;

    return (
      <VideoInfoStyle>
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
            <h2>Channel: {originAuthor}</h2>
          </Header>
          {(audio[0] && (
            <Header>
              <h3>Read by: {audio[0].author.displayName}</h3>
            </Header>
          )) || (
            <Header>
              <h3>Added by: {displayName}</h3>
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
              {showFullDescription ? 'Less' : 'More'}
            </button>
          )}
        </Segment>
      </VideoInfoStyle>
    );
  }
}

VideoInfo.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string.isRequired,
  video: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  showFullDescription: PropTypes.bool.isRequired,
  toggleFullDescription: PropTypes.func.isRequired,
};
