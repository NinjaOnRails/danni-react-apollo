import { Loader } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import ContentLanguage, { contentLanguageQuery } from '../UI/ContentLanguage';
import RenderSmallVideoList from './RenderSmallVideoList';
import { videos, audios } from './Videos';

const LanguageMenuStyles = styled.div`
  text-align: center;
  i.flag {
    margin: 0;
  }
  @media (max-width: 639px) {
    display: none;
  }
`;

const Composed = adopt({
  contentLanguageQuery,
  audios,
  videos,
});

const SmallVideoList = props => {
  const {
    audios: { data: initialAudioData },
    videos: { data: initialVideoData },
  } = props;
  return (
    <Composed>
      {({
        contentLanguageQuery: { contentLanguage },
        audios: {
          loading: loadingAudios,
          error: errorAudios,
          data: dataAudios,
        },
        videos: { loading: loadingVideos, errorVideos, data: dataVideos },
      }) => (
        <>
          <LanguageMenuStyles>
            <ContentLanguage
              currentWatchingLanguage={props.currentWatchingLanguage}
              loadingData={loadingVideos || loadingAudios}
            />
          </LanguageMenuStyles>
          {(!contentLanguage.length &&
            (!initialAudioData || !initialVideoData)) ||
          (contentLanguage.length &&
            (loadingAudios ||
              loadingVideos ||
              (!dataVideos && !dataAudios))) ? (
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
      )}
    </Composed>
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
