import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Placeholder, Card, Icon, Image } from 'semantic-ui-react';
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
      originAuthor
      audio {
        id
        title
        author {
          displayName
        }
      }
      addedBy {
        displayName
      }
    }
  }
`;

const VideosListStyled = styled.div`
  font-size: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  margin: 0 auto;
  justify-items: center;
  image {
    cursor: pointer;
  }
  .ui.placeholder .rectangular.image:not(.header) {
    width: 320px;
    height: 180px;
  }
  @media (max-width: 630px) {
    grid-template-columns: 1fr;
  }
  @media (min-width: 1000px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
  @media (min-width: 1500px) {
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
  @media (min-width: 1800px) {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
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
                  originAuthor,
                  id,
                  audio,
                  duration,
                  addedBy,
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
                            <Card>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={originTitle}
                                label={{
                                  color: 'black',
                                  content: `${Math.round(
                                    duration / 60
                                  )}:${duration % 60}`,
                                  corner: 'right',
                                  size: 'large',
                                }}
                              />
                              <Card.Content>
                                <Card.Header>
                                  {originTitle.length > 70
                                    ? `${originTitle.substring(0, 70)}...`
                                    : originTitle}
                                </Card.Header>
                                <Card.Meta>{originAuthor}</Card.Meta>
                                <Card.Description>
                                  <Icon name="user" />
                                  {addedBy.displayName}
                                </Card.Description>
                              </Card.Content>
                            </Card>
                          </a>
                        </Link>
                      </div>
                    );
                  }

                  return audio.map(
                    ({ title, id: audioId, author: { displayName } }) => (
                      <div key={id}>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id, audioId },
                          }}
                        >
                          <a>
                            <Card>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={title}
                                label={{
                                  color: 'black',
                                  content: `${Math.round(
                                    duration / 60
                                  )}:${duration % 60}`,
                                  corner: 'right',
                                  size: 'large',
                                }}
                              />
                              <Card.Content>
                                <Card.Header>
                                  {title.length > 70
                                    ? `${title.substring(0, 70)}...`
                                    : title}
                                </Card.Header>
                                <Card.Meta>{originAuthor}</Card.Meta>
                                <Card.Description>
                                  <Icon name="user" />
                                  {displayName}
                                </Card.Description>
                              </Card.Content>
                            </Card>
                          </a>
                        </Link>
                      </div>
                    )
                  );
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
