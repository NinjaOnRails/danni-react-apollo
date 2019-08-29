import PropTypes from 'prop-types';
import Watch from '../components/Watch';

const WatchPage = props => {
  return <Watch {...props} />;
};

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
