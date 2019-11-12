import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Loader } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import ContentLanguage from '../UI/ContentLanguage';
import RenderSmallVideoList from './RenderSmallVideoList';
import { useLocalStateQuery } from '../Authentication/authHooks';
import { useQueryAllAudios, useQueryAllVideos } from './videoHooks';

const LanguageMenuStyles = styled.div`
  text-align: center;
  i.flag {
    margin: 0;
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

const SmallVideoList = props => {
  const {
    audios: { data: initialAudioData },
    videos: { data: initialVideoData },
    currentWatchingLanguage,
  } = props;

  const {
    loading: loadingAudios,
    error: errorAudios,
    data: dataAudios,
  } = useQueryAllAudios();
  const {
    loading: loadingVideos,
    errorVideos,
    data: dataVideos,
  } = useQueryAllVideos();

  const { contentLanguage } = useLocalStateQuery();
  return (
    <>
      <LanguageMenuStyles>
        <ContentLanguage
          currentWatchingLanguage={currentWatchingLanguage}
          loadingData={loadingVideos || loadingAudios}
        />
      </LanguageMenuStyles>
      {(!contentLanguage.length && (!initialAudioData || !initialVideoData)) ||
      (contentLanguage.length &&
        (loadingAudios || loadingVideos || (!dataVideos && !dataAudios))) ? (
        <Loader active inline="centered" />
      ) : errorAudios ? (
        <Error>Error: {errorAudios.message}</Error>
      ) : errorVideos ? (
        <Error>Error: {errorVideos.message}</Error>
      ) : (
        <RenderSmallVideoList
          dataAudios={dataAudios || initialAudioData}
          dataVideos={dataVideos || initialVideoData}
          {...props}
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
  audios: PropTypes.object.isRequired,
  videos: PropTypes.object.isRequired,
};

SmallVideoList.defaultProps = {
  audioId: '',
  currentWatchingLanguage: undefined,
};

export default SmallVideoList;
