import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { Placeholder, Card, Icon, Image } from 'semantic-ui-react';
import Link from 'next/link';
import Error from '../ui/ErrorMessage';

const ALL_VIDEOS_QUERY = gql`
  query ALL_VIDEOS_QUERY {
    videos(orderBy: createdAt_DESC) {
      id
      originThumbnailUrl
      originThumbnailUrlSd
      originTitle
      duration
      originAuthor
      originViewCount
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
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 210px 210px 210px 210px 210px;
  grid-gap: 5px;
  margin: 0 auto;
  justify-content: center;
  padding: 0;
  .ui.card {
    box-shadow: none;
  }
  .ui.large.label {
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;
  }

  .ui.card > .content > .header {
    font-family: ${props => props.theme.font};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* Show only first 2 lines */
    line-height: 1.6rem; /* Implement for browsers with no support for webkit */
    max-height: 3.2rem; /* This is line height X no. of lines to show */
  }
  .ui.card > .content > .meta + .description {
    margin-top: 0;
  }
  .ui.placeholder .rectangular.image:not(.header) {
    width: 210px;
    height: 118.13px;
    padding-top: 0;
  }
  @media (max-width: 479px) {
    grid-template-columns: auto;
    .ui.placeholder .rectangular.image:not(.header) {
      width: 320px;
      height: 180px;
    }
  }
  @media (min-width: 480px) {
    grid-template-columns: 210px 210px;
    .ui.card > .content {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  @media (min-width: 720px) {
    grid-template-columns: 210px 210px 210px;
  }
  @media (min-width: 960px) {
    grid-template-columns: 210px 210px 210px 210px;
  }
  @media (min-width: 1280px) {
    grid-template-columns: 210px 210px 210px 210px 210px;
  }
  @media (min-width: 1600px) {
    grid-template-columns: 210px 210px 210px 210px 210px 210px;
  }
  @media (min-width: 1920px) {
    grid-template-columns: 210px 210px 210px 210px 210px 210px 210px;
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
                {[...Array(28)].map((x, i) => (
                  <span key={i}>
                    <Placeholder fluid>
                      <Placeholder.Image rectangular />
                      <Placeholder.Paragraph>
                        <Placeholder.Line length="very long" />
                        <Placeholder.Line length="short" />
                        <Placeholder.Line length="medium" />
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
                  originViewCount,
                  id,
                  audio,
                  duration,
                  addedBy,
                }) => {
                  // Convert and format duration
                  const seconds = duration % 60;
                  const displayDuration = `${Math.round(duration / 60)}:${
                    seconds > 9 ? seconds : `0${seconds}`
                  }`;

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
                            <Card fluid>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={originTitle}
                                label={{
                                  color: 'black',
                                  content: displayDuration,
                                  size: 'large',
                                }}
                              />
                              <Card.Content>
                                <Card.Header>{originTitle}</Card.Header>
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
                      <div key={audioId}>
                        <Link
                          href={{
                            pathname: '/watch',
                            query: { id, audioId },
                          }}
                        >
                          <a>
                            <Card fluid>
                              <Image
                                src={originThumbnailUrl || originThumbnailUrlSd}
                                alt={title}
                                label={{
                                  color: 'black',
                                  content: displayDuration,
                                  size: 'large',
                                }}
                              />
                              <Card.Content>
                                <Card.Header>{title}</Card.Header>
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