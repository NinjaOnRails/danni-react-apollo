import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { List, Image, Loader, Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { ALL_VIDEOS_QUERY } from './Videos';
import Error from './ErrorMessage';

const VideoItem = styled.div`
  display: flex !important;
  align-items: center !important;
  cursor: pointer;
  .content {
    padding-left: 0.5rem;
  }
  .ui.image img {
    max-width: 168px;
  }
  .ui.label {
    position: absolute;
    z-index: 1;
    bottom: 2px;
    right: 2px;
  }
`;

const ListHeaderStyled = styled(List.Header)`
  &&&& {
    font-size: 1.1rem;
    font-family: ${props => props.theme.font};
  }
`;

const ListDescriptionStyled = styled(List.Description)`
  &&&& {
    font-size: 1rem;
  }
`;

class VideoList extends Component {
  componentDidUpdate() {
    window.scrollTo(0, 0);
  }

  render() {
    const { id, audioId } = this.props;
    return (
      <Query query={ALL_VIDEOS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <Loader active />;
          if (error) return <Error>Error: {error.message}</Error>;
          return (
            <List divided relaxed>
              {data.videos.map(
                ({
                  audio: audios,
                  id: videoId,
                  originThumbnailUrl,
                  originThumbnailUrlSd,
                  originTitle,
                  originAuthor,
                  duration,
                  addedBy: { displayName },
                }) => {
                  // Convert and format duration
                  const seconds = duration % 60;
                  const displayDuration = `${Math.round(duration / 60)}:${
                    seconds > 9 ? seconds : `0${seconds}`
                  }`;

                  if (audios.length === 0 && videoId !== id) {
                    return (
                      <List.Item key={videoId}>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id: videoId },
                          }}
                        >
                          <a>
                            <VideoItem>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={originTitle}
                                label={{
                                  color: 'black',
                                  content: displayDuration,
                                }}
                              />
                              <List.Content>
                                <ListHeaderStyled>
                                  {originTitle.length > 34
                                    ? `${originTitle.substring(0, 34)}...`
                                    : originTitle}
                                </ListHeaderStyled>
                                <ListDescriptionStyled>
                                  {originAuthor}
                                </ListDescriptionStyled>
                                <ListDescriptionStyled>
                                  <Icon name="user" />
                                  {displayName}
                                </ListDescriptionStyled>
                              </List.Content>
                            </VideoItem>
                          </a>
                        </Link>
                      </List.Item>
                    );
                  }

                  return audios.map(
                    audio =>
                      audioId !== audio.id && (
                        <List.Item key={audio.id}>
                          <Link
                            href={{
                              pathname: '/watch',
                              query: { id: videoId, audioId: audio.id },
                            }}
                          >
                            <a>
                              <VideoItem>
                                <Image
                                  src={
                                    originThumbnailUrl || originThumbnailUrlSd
                                  }
                                  alt={audio.title}
                                  label={{
                                    color: 'black',
                                    content: displayDuration,
                                  }}
                                />
                                <List.Content>
                                  <ListHeaderStyled>
                                    {audio.title.length > 34
                                      ? `${audio.title.substring(0, 34)}...`
                                      : audio.title}
                                  </ListHeaderStyled>
                                  <ListDescriptionStyled>
                                    {originAuthor}
                                  </ListDescriptionStyled>
                                  <ListDescriptionStyled>
                                    <Icon name="user" />
                                    {audio.author.displayName}
                                  </ListDescriptionStyled>
                                </List.Content>
                              </VideoItem>
                            </a>
                          </Link>
                        </List.Item>
                      )
                  );
                }
              )}
            </List>
          );
        }}
      </Query>
    );
  }
}

VideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

VideoList.defaultProps = {
  audioId: '',
};

export default VideoList;
