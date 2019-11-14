import { Loader } from 'semantic-ui-react';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Error from '../UI/ErrorMessage';
import ContentLanguage, { contentLanguageQuery } from '../UI/ContentLanguage';
import RenderSmallVideoList from './RenderSmallVideoList';
import { videos } from './Videos';

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
  videos,
});

const SmallVideoList = props => {
  const {
    videos: { data: initialVideoData },
  } = props;
  return (
    <Composed>
      {({
        contentLanguageQuery: { contentLanguage },
        videos: {
          loading: loadingVideos,
          errorVideos,
          data: dataVideos,
          fetchMore,
        },
      }) => (
        <>
          <LanguageMenuStyles>
            <ContentLanguage
              currentWatchingLanguage={props.currentWatchingLanguage}
              loadingData={loadingVideos}
            />
          </LanguageMenuStyles>
          {errorVideos ? (
            <Error>Error: {errorVideos.message}</Error>
          ) : (
            <RenderSmallVideoList
              dataVideos={dataVideos || initialVideoData}
              fetchMore={fetchMore}
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
  videos: PropTypes.object.isRequired,
};

SmallVideoList.defaultProps = {
  audioId: '',
  currentWatchingLanguage: undefined,
};

export default SmallVideoList;
