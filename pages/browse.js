import Videos from '../components/Video/Videos';
import Jumbotron from '../components/UI/Jumbotron';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchVideosByTags from '../lib/fetchVideosByTags';

const Browse = props => {
  return (
    <>
      <Jumbotron />
      <Videos {...props} />
    </>
  );
};

Browse.getInitialProps = ({ req, apolloClient, query }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const tags = query.tags.split(',');
  const contentLanguage = ['VIETNAMESE'];
  return fetchVideosByTags({
    client: apolloClient,
    contentLanguage,
    tags
  });
};

export default Browse;
