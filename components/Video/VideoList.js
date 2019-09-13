import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { List, Image, Loader, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import {
  VideoItem,
  ListDescriptionStyled,
  ListHeaderStyled,
} from '../styles/VideoListStyles';
import ContentLanguage, {
  CONTENT_LANGUAGE_QUERY,
  ALL_AUDIOS_QUERY,
  ALL_VIDEOS_QUERY,
} from '../UI/ContentLanguage';

const LanguageMenuStyles = styled.div`
  text-align: center;
  i.flag {
    margin: 0;
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

class VideoList extends Component {
  renderVideoList = (audios, videos) => {
    const { id, audioId, onVideoItemClick } = this.props;

    return (
      <List divided relaxed>
        {audios.map(audio => {
          const {
            id: videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          } = audio.video;
          // Convert and format duration
          const seconds = duration % 60;
          const displayDuration = `${Math.round(duration / 60)}:${
            seconds > 9 ? seconds : `0${seconds}`
          }`;

          if (audioId !== audio.id) {
            return (
              <List.Item key={audio.id} onClick={() => onVideoItemClick()}>
                <Link
                  href={{
                    pathname: '/watch',
                    query: { id: videoId, audioId: audio.id },
                  }}
                >
                  <a>
                    <VideoItem>
                      <Image
                        src={originThumbnailUrl || originThumbnailUrlSd}
                        alt={audio.title}
                        label={{
                          color: 'black',
                          content: displayDuration,
                        }}
                      />
                      <List.Content>
                        <ListHeaderStyled>{audio.title}</ListHeaderStyled>
                        <ListDescriptionStyled>
                          {originAuthor}
                        </ListDescriptionStyled>
                        <ListDescriptionStyled>
                          <Icon name="user" />
                          {audio.author.displayName}
                        </ListDescriptionStyled>
                      </List.Content>
                    </VideoItem>
                  </a>
                </Link>
              </List.Item>
            );
          }
          return null;
        })}
        {videos.map(
          ({
            audio,
            originTitle,
            addedBy: { displayName },
            id: videoId,
            originThumbnailUrl,
            originThumbnailUrlSd,
            originAuthor,
            duration,
          }) => {
            // Convert and format duration
            const seconds = duration % 60;
            const displayDuration = `${Math.round(duration / 60)}:${
              seconds > 9 ? seconds : `0${seconds}`
            }`;

            if (audio.length === 0 && videoId !== id) {
              return (
                <List.Item key={videoId} onClick={() => onVideoItemClick()}>
                  <Link
                    href={{
                      pathname: '/watch',
                      query: { id: videoId },
                    }}
                  >
                    <a>
                      <VideoItem>
                        <Image
                          src={originThumbnailUrl || originThumbnailUrlSd}
                          alt={originTitle}
                          label={{
                            color: 'black',
                            content: displayDuration,
                          }}
                        />
                        <List.Content>
                          <ListHeaderStyled>{originTitle}</ListHeaderStyled>
                          <ListDescriptionStyled>
                            {originAuthor}
                          </ListDescriptionStyled>
                          <ListDescriptionStyled>
                            <Icon name="user" />
                            {displayName}
                          </ListDescriptionStyled>
                        </List.Content>
                      </VideoItem>
                    </a>
                  </Link>
                </List.Item>
              );
            }
            return null;
          }
        )}
      </List>
    );
  };

  render() {
    return (
      <>
        <LanguageMenuStyles>
          <ContentLanguage />
        </LanguageMenuStyles>
        <Query query={CONTENT_LANGUAGE_QUERY}>
          {({ data, loading }) => {
            if (loading) return <Loader active />;
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
                        return <Loader active />;
                      if (errorAudios)
                        return <Error>Error: {errorAudios.message}</Error>;
                      if (errorVideos)
                        return <Error>Error: {errorVideos.message}</Error>;
                      return this.renderVideoList(
                        dataAudios.audios,
                        dataVideos.videos
                      );
                    }}
                  </Query>
                )}
              </Query>
            );
          }}
        </Query>
      </>
    );
  }
}

VideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
};

VideoList.defaultProps = {
  audioId: '',
};

export default VideoList;
