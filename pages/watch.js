import { Grid } from 'semantic-ui-react';
import Watch from '../components/Watch';
import VideoList from '../components/VideoList';

const WatchPage = () => {
  return (
    <Grid>
      <Grid.Row>
        <Grid.Column mobile={16} tablet={16} computer={11}>
          <Watch />
        </Grid.Column>
        <Grid.Column mobile={16} tablet={16} computer={5}>
          <VideoList />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default WatchPage;
