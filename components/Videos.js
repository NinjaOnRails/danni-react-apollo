import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Link from 'next/link';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    videos(orderBy: createdAt_DESC) {
      id
      titleVi
      originThumbnailUrl
      originThumbnailUrlSd
    }
  }
`;

const Center = styled.div`
  text-align: center;
`;

const VideosListStyled = styled.div`
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
  h2 {
    font-family: ${props => props.theme.font};
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
              <VideosListStyled>
                {data.videos.map(video => {
                  const {
                    originThumbnailUrl,
                    originThumbnailUrlSd,
                    id,
                    titleVi,
                  } = video;
                  return (
                    <div key={id}>
                      <Link
                        href={{
                          pathname: '/watch',
                          query: { id },
                        }}
                      >
                        <a>
                          <img
                            src={originThumbnailUrl || originThumbnailUrlSd}
                            alt={titleVi}
                          />
                        </a>
                      </Link>
                      <Link
                        href={{
                          pathname: '/watch',
                          query: { id },
                        }}
                      >
                        <a>
                          <h2>{titleVi}</h2>
                        </a>
                      </Link>
                    </div>
                  );
                })}
              </VideosListStyled>
            );
          }}
        </Query>
      </Center>
    );
  }
}

export default Videos;
export { ALL_VIDEOS_QUERY };
