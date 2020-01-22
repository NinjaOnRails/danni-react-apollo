import { Query } from 'react-apollo';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import PropTypes from 'prop-types';
import Error from '../UI/ErrorMessage';
import { ALL_VIDEOS_QUERY } from '../../graphql/query';
import RenderVideoList from './RenderVideoList';
import TagsMenu from '../UI/TagsMenu';
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
const videos = ({ contentLanguageQuery: { contentLanguage }, render }) => (
  /* eslint-enable */
  <Query query={ALL_VIDEOS_QUERY} variables={{ contentLanguage }}>
    {render}
  </Query>
);

const Composed = adopt({
  contentLanguageQuery,
  videos,
});

const Videos = ({ videos: { data: initialVideoData } }) => (
  <Composed>
    {({
      videos: {
        loading: loadingVideos,
        errorVideos,
        data: dataVideos,
        fetchMore,
      },
    }) => (
      <>
        <LanguageMenuStyles>
          {/* <ContentLanguage loadingData={loadingVideos} /> */}
        </LanguageMenuStyles>
        <TagsMenu />
        {errorVideos ? (
          <Error>Error: {errorVideos.message}</Error>
        ) : (
          <RenderVideoList
            dataVideos={dataVideos || initialVideoData}
            fetchMore={fetchMore}
          />
        )}
      </>
    )}
  </Composed>
);

Videos.propTypes = {
  videos: PropTypes.object.isRequired,
};

export default Videos;
export { videos };
