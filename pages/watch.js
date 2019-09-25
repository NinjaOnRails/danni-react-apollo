import { ApolloConsumer } from 'react-apollo';
import Watch from '../components/Video/Watch';
import { VIDEO_QUERY } from '../graphql/query';
import fetchAudiosVideos from '../lib/fetchAudiosVideos';

const WatchPage = props => (
  <ApolloConsumer>
    {client => <Watch {...props} client={client} />}
  </ApolloConsumer>
);

// Get and pass query params as props
WatchPage.getInitialProps = async ({
  query: { id, audioId },
  asPath,
  apolloClient,
}) => {
  const payload = await apolloClient.query({
    query: VIDEO_QUERY,
    variables: {
      id,
      audioId,
    },
  });

  if (!payload.data) return { id, audioId, asPath, payload };

  const {
    data: { video },
  } = payload;

  const contentLanguage = [];

  if (video.audio[0]) {
    contentLanguage.push(video.audio[0].language);
  } else {
    contentLanguage.push(video.language);
  }

  const { audios, videos } = await fetchAudiosVideos({
    client: apolloClient,
    contentLanguage,
  });

  return { id, audioId, asPath, payload, videos, audios };
};

export default WatchPage;
