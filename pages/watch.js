import { ApolloConsumer } from 'react-apollo';
import Watch, { VIDEO_QUERY } from '../components/Video/Watch';

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
  return { id, audioId, asPath, payload };
};

export default WatchPage;
