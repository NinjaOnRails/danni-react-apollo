import { Icon, Header, Button } from 'semantic-ui-react';
import styled from 'styled-components';
import Videos from '../components/Video/Videos';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchAudiosVideos from '../lib/fetchAudiosVideos';

const Jumbotron = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 80%;
  margin: 20px auto;
  /* background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url(/static/GettyImages-682732546.jpg);
  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  border-radius: 0.38em; */
  h1.ui.header {
    font-family: 'Verdana';
    color: ${props => props.theme.font};
    font-size: 1.5em;
    font-weight: 600;
    line-height: 1.33;
  }
  img {
    /* width: 80%; */
    width: 50%;
    max-width: 500px;
    height: auto;
    display: block;
  }
  .intro {
    width: 50%;
    max-width: 500px;
    max-height: 100%;
  }
`;

const Home = props => (
  <>
    <Jumbotron>
      <div className="intro">
        <Header as="h1">Video dịch và lồng tiếng bởi cộng đồng</Header>
        <Button primary size="big">
          Tìm hiểu thêm <Icon name="right arrow" />
        </Button>
      </div>
    <Videos {...props} />
  </>
);

Home.getInitialProps = ({ req, apolloClient }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const contentLanguage = ['VIETNAMESE'];
  return fetchAudiosVideos({ client: apolloClient, contentLanguage });
};

export default Home;
