import Videos from '../components/Video/Videos';
import { ALL_AUDIOS_QUERY, ALL_VIDEOS_QUERY } from '../graphql/query';
import { getSupportedLanguage } from '../lib/supportedLanguages';

const Home = props => <Videos {...props} />;

Home.getInitialProps = async ({ req, apolloClient }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const contentLanguage = ['VIETNAMESE'];
  const audios = await apolloClient.query({
    query: ALL_AUDIOS_QUERY,
    variables: { contentLanguage },
  });
  const videos = await apolloClient.query({
    query: ALL_VIDEOS_QUERY,
    variables: { contentLanguage },
  });
  return { audios, videos };
};

export default Home;
