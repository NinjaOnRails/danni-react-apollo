import styled from 'styled-components';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import RenderVideoList from './RenderVideoList';
import ContentLanguage, { contentLanguageQuery } from '../UI/ContentLanguage';
import { useAllVideosQuery } from './videoHooks';

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
  const {
    data: dataVideos,
    fetchMore,
    errorVideos,
    loading: loadingVideos,
  } = useAllVideosQuery();
  return (
    <>
      <LanguageMenuStyles>
        {/* <ContentLanguage loadingData={loadingVideos} /> */}
      </LanguageMenuStyles>
      {errorVideos ? (
        <Error>Error: {errorVideos.message}</Error>
      ) : (
        <RenderVideoList
          dataVideos={dataVideos || initialVideoData}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

Videos.propTypes = {
  videos: PropTypes.object.isRequired,
};

export default Videos;
