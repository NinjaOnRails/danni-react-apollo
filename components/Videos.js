import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    videos {
      id
      title
      channelTitle
      thumbnailUrl
      defaultLanguage
      audio {
        id
        source
        language
      }
      createdAt
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const VideosList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`;

class Videos extends Component {
  render() {
    return (
      <div>
        <p>Videos</p>
        <Query query={ALL_VIDEOS_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <VideosList>
                {data.videos.map(video => {
                  return (
                    <div key={video.id}>
                      <img src={video.thumbnailUrl} alt={video.title} />
                      <p>{video.title}</p>
                      <p>Channel: {video.channelTitle}</p>
                      <p>Original Language: {video.defaultLanguage}</p>
                    </div>
                  );
                })}
              </VideosList>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default Videos;
export { ALL_VIDEOS_QUERY };
