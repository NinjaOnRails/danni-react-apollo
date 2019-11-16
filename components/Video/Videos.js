import styled from 'styled-components';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import VideosLoading from './VideoLoading';
import RenderVideoList from './RenderVideoList';
import VideoListStyles from '../styles/VideoListStyles';
import ContentLanguage from '../UI/ContentLanguage';
import { useLocalStateQuery } from '../Authentication/authHooks';
import { useQueryAllVideos } from './videoHooks';

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

const Videos = ({ videos: { data: initialVideoData } }) => {
  const { contentLanguage } = useLocalStateQuery();

  const {
    loading: loadingVideos,
    errorVideos,
    data: dataVideos,
  } = useQueryAllVideos(contentLanguage);
  return (
    <>
      <LanguageMenuStyles>
        <ContentLanguage loadingData={loadingVideos} />
      </LanguageMenuStyles>
      <VideoListStyles>
        {errorVideos ? (
          <Error>Error: {errorVideos.message}</Error>
        ) : (
          <RenderVideoList dataVideos={dataVideos || initialVideoData} />
        )}
      </VideoListStyles>
    </>
  );
};

Videos.propTypes = {
  videos: PropTypes.object.isRequired,
};

export default Videos;
