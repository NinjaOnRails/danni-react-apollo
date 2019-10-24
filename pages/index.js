import { Image, Header } from 'semantic-ui-react';
import styled from 'styled-components';
import Videos from '../components/Video/Videos';
import { getSupportedLanguage } from '../lib/supportedLanguages';
import fetchAudiosVideos from '../lib/fetchAudiosVideos';

const Jumbotron = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  h1.ui.header {
    max-width: 500px;
    font-family: 'Verdana';
    color: ${props => props.theme.font};
    font-size: 40px;
    font-weight: 600;
    line-height: 1.33;
  }
  img {
    width: 100%;
    max-width: 500px;
    height: auto;
    display: block;
  }
`;

const Home = props => (
  <>
    <Jumbotron>
      <Header as="h1">Video do các bạn tự nguyện dịch và lồng tiếng</Header>
      <img src="/static/GettyImages-682732546.jpg" alt="bridge" />
    </Jumbotron>
    <Videos {...props} />
  </>
);

Home.getInitialProps = ({ req, apolloClient }) => {
  // const contentLanguage = getSupportedLanguage(req.headers['accept-language']);
  const contentLanguage = ['VIETNAMESE'];
  return fetchAudiosVideos({ client: apolloClient, contentLanguage });
};

export default Home;
