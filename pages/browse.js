import Videos from '../components/Video/Videos';
import Jumbotron from '../components/UI/Jumbotron';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchVideos from '../lib/fetchVideos';

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
  const contentLanguage = ['VIETNAMESE'];
  return fetchVideos({
    client: apolloClient,
    contentLanguage,
    tags: query.tags,
  });
};

export default Home;
