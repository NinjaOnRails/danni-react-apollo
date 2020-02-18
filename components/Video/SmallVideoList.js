import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Radio } from 'semantic-ui-react';
import Error from '../UI/ErrorMessage';
import ContentLanguage, { contentLanguageQuery } from '../UI/ContentLanguage';
import RenderSmallVideoList from './RenderSmallVideoList';
import { useLocalStateQuery } from '../Authentication/authHooks';
import { useToggleAutoplayMutation, useAllVideosQuery } from './videoHooks';

const AutoplayToggle = styled.div`
  font-weight: 600;
  border-bottom: 1px solid rgba(34, 36, 38, 0.15);
  .radio-button {
    display: inline-block;
    margin-left: 5px;
    vertical-align: sub;
  }
`;

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
}) => {
  const { allowAutoplay } = useLocalStateQuery();
  const {
    data: dataVideos,
    fetchMore,
    errorVideos,
    loading: loadingVideos,
  } = useAllVideosQuery();
  const [toggleAllowAutoplay] = useToggleAutoplayMutation();

  return (
    <>
      <LanguageMenuStyles>
        {/* <ContentLanguage
              currentWatchingLanguage={props.currentWatchingLanguage}
              loadingData={loadingVideos}
            /> */}
      </LanguageMenuStyles>
      <AutoplayToggle>
        Tự động phát
        <div className="radio-button">
          <Radio
            toggle
            onChange={toggleAllowAutoplay}
            checked={allowAutoplay}
          />
        </div>
      </AutoplayToggle>

      {errorVideos ? (
        <Error>Error: {errorVideos.message}</Error>
      ) : (
        <RenderSmallVideoList
          dataVideos={dataVideos || initialVideoData}
          fetchMore={fetchMore}
          id={id}
          audioId={audioId}
        />
      )}
    </>
  );
};

SmallVideoList.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
  currentWatchingLanguage: PropTypes.string,
  videos: PropTypes.object.isRequired,
};

SmallVideoList.defaultProps = {
  audioId: '',
  currentWatchingLanguage: undefined,
};

export default SmallVideoList;
