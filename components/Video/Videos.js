import { Query } from 'react-apollo';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import Error from '../UI/ErrorMessage';
import { ALL_AUDIOS_QUERY, ALL_VIDEOS_QUERY } from '../../graphql/query';
import VideosLoading from './VideosLoading';
import RenderVideos from './RenderVideos';
import VideosListStyles from '../styles/VideosListStyles';
import ContentLanguage, { contentLanguageQuery } from '../UI/ContentLanguage';

const LanguageMenuStyles = styled.div`
  padding-bottom: 2rem;
  text-align: center;
  i.flag {
    margin: 0;
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

/* eslint-disable */
const audios = ({ contentLanguageQuery: { contentLanguage }, render }) => (
  <Query query={ALL_AUDIOS_QUERY} variables={{ contentLanguage }}>
    {render}
  </Query>
);

const videos = ({ contentLanguageQuery: { contentLanguage }, render }) => (
  <Query query={ALL_VIDEOS_QUERY} variables={{ contentLanguage }}>
    {render}
  </Query>
);
/* eslint-enable */

const Composed = adopt({
  contentLanguageQuery,
  audios,
  videos,
});

const Videos = () => {
  return (
    <>
      <LanguageMenuStyles>
        <ContentLanguage />
      </LanguageMenuStyles>
      <VideosListStyles>
        <Composed>
          {({
            contentLanguageQuery: { contentLanguage },
            audios: {
              loading: loadingAudios,
              error: errorAudios,
              data: dataAudios,
            },
            videos: { loading: loadingVideos, errorVideos, data: dataVideos },
          }) => {
            if (!contentLanguage.length || loadingAudios || loadingVideos)
              return <VideosLoading />;
            if (errorAudios) return <Error>Error: {errorAudios.message}</Error>;
            if (errorVideos) return <Error>Error: {errorVideos.message}</Error>;
            return (
              <RenderVideos dataAudios={dataAudios} dataVideos={dataVideos} />
            );
          }}
        </Composed>
      </VideosListStyles>
    </>
  );
};

export default Videos;
export { audios, videos };
