import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import Link from 'next/link';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    videos {
      id
      titleVi
      originAuthor
      originThumbnailUrl
      originLanguage
      addedBy
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
  img {
    cursor: pointer;
  }
  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 1300px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
`;

class Videos extends Component {
  render() {
    return (
      <Center>
        <Query query={ALL_VIDEOS_QUERY}>
          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error: {error.message}</p>;

            return (
              <VideosList>
                {data.videos.map(video => {
                  return (
                    <div key={video.id}>
                      <Link
                        href={{
                          pathname: '/watch',
                          query: { id: video.id },
                        }}
                      >
                        <img
                          src={video.originThumbnailUrl}
                          alt={video.titleVi}
                        />
                      </Link>
                      <h3>{video.titleVi}</h3>
                      {/* <h4>{video.channelTitle}</h4> */}
                      {/* {video.defaultLanguage && <p>{video.defaultLanguage}</p>} */}
                    </div>
                  );
                })}
              </VideosList>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default Videos;
export { ALL_VIDEOS_QUERY };
