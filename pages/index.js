import Videos from '../components/Video/Videos';
import Jumbotron from '../components/UI/Jumbotron';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchAudiosVideos from '../lib/fetchAudiosVideos';

const Home = props => (
  <>
    <Jumbotron />
    <Videos {...props} />
  </>
);

Home.getInitialProps = ({ req, apolloClient }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const contentLanguage = ['VIETNAMESE'];
  return fetchAudiosVideos({ client: apolloClient, contentLanguage });
};

export default Home;
