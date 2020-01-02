import Videos from '../components/Video/Videos';
import Jumbotron from '../components/UI/Jumbotron';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchVideos from '../lib/fetchVideosByTags';

const Home = props => {
  return (
    <>
      <Jumbotron />
      <Videos {...props} />
    </>
  );
};

Home.getInitialProps = ({ req, apolloClient, query }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const tags = query.tags.split(',');
  const contentLanguage = ['VIETNAMESE'];
  return fetchVideos({
    client: apolloClient,
    contentLanguage,
    tags
  });
};

export default Home;
