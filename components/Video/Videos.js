import styled from 'styled-components';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import VideosLoading from './VideoLoading';
import RenderVideoList from './RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import ContentLanguage from '../UI/ContentLanguage';
import { useLocalStateQuery } from '../Authentication/authHooks';
import { useQueryAllAudios, useQueryAllVideos } from './videoHooks';

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

const Videos = ({
  audios: { data: initialAudioData },
  videos: { data: initialVideoData },
}) => {
  const { contentLanguage } = useLocalStateQuery();
  const {
    loading: loadingAudios,
    error: errorAudios,
    data: dataAudios,
  } = useQueryAllAudios(contentLanguage);
  const {
    loading: loadingVideos,
    errorVideos,
    data: dataVideos,
  } = useQueryAllVideos(contentLanguage);
  return (
    <>
      <LanguageMenuStyles>
        <ContentLanguage loadingData={loadingAudios || loadingVideos} />
      </LanguageMenuStyles>
      <VideoListStyles>
        {(!contentLanguage.length &&
          (!initialVideoData && !initialAudioData)) ||
        (contentLanguage.length &&
          (loadingAudios || loadingVideos || (!dataVideos && !dataAudios))) ? (
          <VideosLoading />
        ) : errorAudios ? (
          <Error>Error: {errorAudios.message}</Error>
        ) : errorVideos ? (
          <Error>Error: {errorVideos.message}</Error>
        ) : (
          <RenderVideoList
            dataAudios={dataAudios || initialAudioData}
            dataVideos={dataVideos || initialVideoData}
          />
        )}
      </VideoListStyles>
    </>
  );
};

Videos.propTypes = {
  audios: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
};

export default Videos;
