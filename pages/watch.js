import PropTypes from 'prop-types';
import { ApolloConsumer } from 'react-apollo';
import Watch from '../components/Video/Watch';

const WatchPage = props => (
  <ApolloConsumer>
    {client => <Watch {...props} client={client} />}
  </ApolloConsumer>
);

// Get and pass query params as props
WatchPage.getInitialProps = ({ query: { id, audioId } }) => {
  return { id, audioId };
};

WatchPage.propTypes = {
  id: PropTypes.string.isRequired,
  audioId: PropTypes.string,
};

WatchPage.defaultProps = {
  audioId: '',
};

export default WatchPage;
