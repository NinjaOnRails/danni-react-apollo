import { Query } from 'react-apollo';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
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

const Videos = ({
  audios: { data: initialAudioData },
  videos: { data: initialVideoData },
}) => (
  <Composed>
    {({
      contentLanguageQuery: { contentLanguage },
      audios: { loading: loadingAudios, error: errorAudios, data: dataAudios },
      videos: { loading: loadingVideos, errorVideos, data: dataVideos },
    }) => {
      return (
        <>
          <LanguageMenuStyles>
            <ContentLanguage loadingData={loadingAudios || loadingVideos} />
          </LanguageMenuStyles>
          <VideosListStyles>
            {(!contentLanguage.length &&
              (!initialVideoData || !initialAudioData)) ||
            (contentLanguage.length &&
              (loadingAudios ||
                loadingVideos ||
                (!dataVideos && !dataAudios))) ? (
              <VideosLoading />
            ) : errorAudios ? (
              <Error>Error: {errorAudios.message}</Error>
            ) : errorVideos ? (
              <Error>Error: {errorVideos.message}</Error>
            ) : (
              <RenderVideos
                dataAudios={dataAudios || initialAudioData}
                dataVideos={dataVideos || initialVideoData}
              />
            )}
          </VideosListStyles>
        </>
      );
    }}
  </Composed>
);

Videos.propTypes = {
  audios: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
};

export default Videos;
export { audios, videos };
