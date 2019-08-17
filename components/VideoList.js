import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { List, Image, Loader } from 'semantic-ui-react';
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
    padding: 0 0 0 0.5em;
  }
  img.ui.image {
    max-width: 180px;
  }
`;

const ListHeaderStyled = styled(List.Header)`
  &&&& {
    font-family: ${props => props.theme.font};
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
              {data.videos.map(video => {
                if (video.audio.length === 0 && video.id !== id) {
                  return (
                    <List.Item key={video.id}>
                      <Link
                        href={{
                          pathname: '/watch',
                          query: { id: video.id },
                        }}
                      >
                        <a>
                          <VideoItem>
                            <Image
                              src={
                                video.originThumbnailUrl ||
                                video.originThumbnailUrlSd
                              }
                              alt={video.originTitle}
                            />
                            <List.Content>
                              <ListHeaderStyled>
                                {video.originTitle}
                              </ListHeaderStyled>
                            </List.Content>
                          </VideoItem>
                        </a>
                      </Link>
                    </List.Item>
                  );
                }

                return video.audio.map(
                  audio =>
                    audioId !== audio.id && (
                      <List.Item key={id}>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id: video.id, audioId: audio.id },
                          }}
                        >
                          <a>
                            <VideoItem>
                              <Image
                                src={
                                  video.originThumbnailUrl ||
                                  video.originThumbnailUrlSd
                                }
                                alt={audio.title}
                              />
                              <List.Content>
                                <ListHeaderStyled>
                                  {audio.title}
                                </ListHeaderStyled>
                              </List.Content>
                            </VideoItem>
                          </a>
                        </Link>
                      </List.Item>
                    )
                );
              })}
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
