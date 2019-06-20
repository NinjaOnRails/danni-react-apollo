import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Link from 'next/link';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    videos {
      id
      titleVi
      originThumbnailUrl
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
            if (loading) return <Loader active />;
            if (error) return <Error>Error: {error.message}</Error>;
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
