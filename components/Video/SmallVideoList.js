import PropTypes from 'prop-types';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import ContentLanguage from '../UI/ContentLanguage';
import RenderSmallVideoList from './RenderSmallVideoList';
import { useQueryAllVideos } from './videoHooks';
import { useLocalStateQuery } from '../Authentication/authHooks';

const LanguageMenuStyles = styled.div`
  text-align: center;
  i.flag {
    margin: 0;
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

const SmallVideoList = ({
  id,
  audioId,
  videos: { data: initialVideoData },
  currentWatchingLanguage,
  onVideoItemClick,
}) => {
  const { contentLanguage } = useLocalStateQuery();
  const {
    loading: loadingVideos,
    errorVideos,
    data: dataVideos,
    fetchMore,
  } = useQueryAllVideos(contentLanguage);

  return (
    <>
      <LanguageMenuStyles>
        <ContentLanguage
          currentWatchingLanguage={currentWatchingLanguage}
          loadingData={loadingVideos}
        />
      </LanguageMenuStyles>
      {errorVideos ? (
        <Error>Error: {errorVideos.message}</Error>
      ) : (
        <RenderSmallVideoList
          dataVideos={dataVideos || initialVideoData}
          id={id}
          audioId={audioId}
          onVideoItemClick={onVideoItemClick}
          fetchMore={fetchMore}
        />
      )}
    </>
  );
};

SmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  currentWatchingLanguage: PropTypes.string,
  onVideoItemClick: PropTypes.func.isRequired,
  videos: PropTypes.object.isRequired,
};

SmallVideoList.defaultProps = {
  audioId: '',
  currentWatchingLanguage: undefined,
};

export default SmallVideoList;
