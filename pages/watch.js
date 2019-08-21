import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Watch from '../components/Watch';
import VideoList from '../components/VideoList';
import CommentList from '../components/CommentList';

const WatchPage = props => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={11}>
          <Watch {...props} />
          {/* <CommentList /> */}
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={5}>
          <VideoList {...props} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
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
