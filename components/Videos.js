import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Placeholder, Card, Image } from 'semantic-ui-react';
import Link from 'next/link';
import Error from './ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY {
    videos(orderBy: createdAt_DESC) {
      id
      originThumbnailUrl
      originThumbnailUrlSd
      originTitle
      duration
      audio {
        id
        title
      }
    }
  }
`;

const VideosListStyled = styled.div`
  font-size: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  image {
    cursor: pointer;
  }
  @media (max-width: 719px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 1100px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (min-width: 1700px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  .ui.placeholder .rectangular.image:not(.header) {
    width: 320px;
    height: 180px;
  }
`;

class Videos extends Component {
  render() {
    return (
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
                        <Card>
                          <Link
                            href={{
                              pathname: '/watch',
                              query: { id },
                            }}
                          >
                            <a>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={originTitle}
                              />
                            </a>
                          </Link>
                          <Card.Content>
                            <Card.Header>
                              <Link
                                href={{
                                  pathname: '/watch',
                                  query: { id },
                                }}
                              >
                                <a>
                                  {originTitle.length > 53
                                    ? `${originTitle.substring(0, 53)}...`
                                    : originTitle}
                                </a>
                              </Link>
                            </Card.Header>
                          </Card.Content>
                        </Card>
                      </div>
                    );
                  }

                  return audio.map(({ title, id: audioId }) => (
                    <div key={id}>
                      <Card>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id, audioId },
                          }}
                        >
                          <a>
                            <Image
                              src={originThumbnailUrl || originThumbnailUrlSd}
                              alt={title}
                            />
                          </a>
                        </Link>
                        <Card.Content>
                          <Card.Header>
                            <Link
                              href={{
                                pathname: '/watch',
                                query: { id, audioId },
                              }}
                            >
                              <a>
                                {title.length > 53
                                  ? `${title.substring(0, 53)}...`
                                  : title}
                              </a>
                            </Link>
                          </Card.Header>
                        </Card.Content>
                      </Card>
                    </div>
                  ));
                }
              )}
            </VideosListStyled>
          );
        }}
      </Query>
    );
  }
}

export default Videos;
export { ALL_VIDEOS_QUERY };
