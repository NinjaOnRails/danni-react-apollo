import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import Watch from '../components/Watch';
import VideoList from '../components/VideoList';

const WatchPage = ({ id }) => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={11}>
          <Watch id={id} />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={5}>
          <VideoList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

WatchPage.getInitialProps = async ({ query }) => {
  return { id: query.id };
};

WatchPage.propTypes = {
  id: PropTypes.string.isRequired,
};

export default WatchPage;
