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
  width: 80%;
  height: 50vh;
  margin: auto;
  background-image: linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)),
    url(/static/GettyImages-682732546.jpg);
  /* linear-gradient(
      to right bottom,
      rgba(85, 197, 122, 0.8),
      rgba(126, 213, 111, 0.8)
    ), */

  background-size: contain;
  background-position: top;
  background-repeat: no-repeat;
  border-radius: 0.38em;
  h1.ui.header {
    /* width: 20%; */
    max-width: 500px;
    font-family: 'Verdana';
    color: white;

    ${props => props.theme.font};
    font-size: 3em;
    font-weight: 600;
    line-height: 1.33;
  }
  img {
    /* width: 80%; */
    width: 100%;
    max-width: 500px;
    height: auto;
    display: block;
  }
`;

const Home = props => (
  <>
    <Jumbotron>
      <Header as="h1">Video dịch và lồng tiếng bởi cộng đồng</Header>
      {/* <img src="/static/GettyImages-682732546.jpg" alt="bridge" /> */}
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
