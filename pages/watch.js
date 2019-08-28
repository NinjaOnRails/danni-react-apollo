import { Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Watch from '../components/Watch';
import VideoList from '../components/VideoList';
import CommentList from '../components/CommentList';

const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: 1366px;
  padding: 0px 24px 0px 24px;
  @media (max-width: 760px) {
    padding: 0px;
  }
  @media (max-width: 480px) {
    div.eleven.wide.computer.sixteen.wide.mobile.sixteen.wide.tablet.column {
      padding: 0;
    }
  }
`;

const WatchPage = props => {
  return (
    <StyledContainer>
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
    </StyledContainer>
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
