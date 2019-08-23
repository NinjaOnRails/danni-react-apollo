import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Loader, Placeholder } from 'semantic-ui-react';
import Link from 'next/link';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY {
    videos(orderBy: createdAt_DESC) {
      id
      originThumbnailUrl
      originThumbnailUrlSd
      originTitle
      audio {
        id
        title
      }
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
  .ui.placeholder .rectangular.image:not(.header) {
    width: 320px;
    height: 180px;
  }
`;

class Videos extends Component {
  render() {
    return (
      <Center>
        <Query query={ALL_VIDEOS_QUERY}>
          {({ loading, error, data }) => {
            if (loading) {
              return (
                <VideosListStyled>
                  {[...Array(12)].map((x, i) => (
                    <span key={i}>
                      <Placeholder>
                        <Placeholder.Image rectangular />
                        <Placeholder.Paragraph>
                          <Placeholder.Line />
                          <Placeholder.Line />
                        </Placeholder.Paragraph>
                      </Placeholder>
                    </span>
                  ))}
                </VideosListStyled>
              );
            }

            if (error) return <Error>Error: {error.message}</Error>;

            return (
              <VideosListStyled>
                {data.videos.map(
                  ({
                    originThumbnailUrl,
                    originThumbnailUrlSd,
                    originTitle,
                    id,
                    audio,
                  }) => {
                    if (audio.length === 0) {
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
                                alt={originTitle}
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
                              <h2>
                                {originTitle.length > 53
                                  ? `${originTitle.substring(0, 53)}...`
                                  : originTitle}
                              </h2>
                            </a>
                          </Link>
                        </div>
                      );
                    }

                    return audio.map(({ title, id: audioId }) => (
                      <div key={id}>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id, audioId },
                          }}
                        >
                          <a>
                            <img
                              src={originThumbnailUrl || originThumbnailUrlSd}
                              alt={title}
                            />
                          </a>
                        </Link>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id, audioId },
                          }}
                        >
                          <a>
                            <h2>
                              {title.length > 53
                                ? `${title.substring(0, 53)}...`
                                : title}
                            </h2>
                          </a>
                        </Link>
                      </div>
                    ));
                  }
                )}
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
