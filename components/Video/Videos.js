import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { Card, Icon, Image } from 'semantic-ui-react';
import Link from 'next/link';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import ContentLanguage, {
  CONTENT_LANGUAGE_QUERY,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../UI/ContentLanguage';
import VideosListStyles from '../styles/VideosListStyles';
import VideosLoading from './VideosLoading';

const LanguageMenuStyles = styled.div`
  padding-bottom: 2rem;
  text-align: center;
  @media (max-width: 639px) {
    display: none;
  }
`;

class Videos extends Component {
  renderVideos = (dataAudios, dataVideos) => (
    <>
      {dataAudios.audios.map(
        ({
          title,
          id: audioId,
          author: { displayName },
          video: {
            id,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          },
        }) => {
          // Convert and format duration
          const seconds = duration % 60;
          const displayDuration = `${Math.round(duration / 60)}:${
            seconds > 9 ? seconds : `0${seconds}`
          }`;

          return (
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
          );
        }
      )}
      {dataVideos.videos.map(
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
          return null;
        }
      )}
    </>
  );

  render() {
    return (
      <>
        <LanguageMenuStyles>
          <ContentLanguage />
        </LanguageMenuStyles>
        <VideosListStyles>
          <Query query={CONTENT_LANGUAGE_QUERY}>
            {({ data, loading }) => {
              if (loading) return <VideosLoading />;
              const { contentLanguage = [] } = data;
              return (
                <Query
                  query={ALL_AUDIOS_QUERY}
                  variables={{ contentLanguage }}
                  ssr={false}
                >
                  {({
                    loading: loadingAudios,
                    error: errorAudios,
                    data: dataAudios,
                  }) => (
                    <Query
                      query={ALL_VIDEOS_QUERY}
                      variables={{ contentLanguage }}
                      ssr={false}
                    >
                      {({
                        loading: loadingVideos,
                        errorVideos,
                        data: dataVideos,
                      }) => {
                        if (
                          !contentLanguage.length ||
                          loadingAudios ||
                          loadingVideos
                        )
                          return <VideosLoading />;
                        if (errorAudios)
                          return <Error>Error: {errorAudios.message}</Error>;
                        if (errorVideos)
                          return <Error>Error: {errorVideos.message}</Error>;
                        return this.renderVideos(dataAudios, dataVideos);
                      }}
                    </Query>
                  )}
                </Query>
              );
            }}
          </Query>
        </VideosListStyles>
      </>
    );
  }
}

export default Videos;
