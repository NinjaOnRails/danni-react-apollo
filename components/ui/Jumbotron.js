import { Icon, Header, Button } from 'semantic-ui-react';
import styled from 'styled-components';

const JumbotronStyles = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  width: 80%;
  margin: 20px auto;

  figure {
    width: 50%;
    overflow: hidden; /*hide bounds of image */
    margin: 0; /*reset margin of figure tag*/
  }
  figure img {
    display: block; /*remove inline-block spaces*/
    margin: -15% -25%;
    width: 157%;
  }

  .intro {
    width: 50%;
    max-width: 500px;
    max-height: 100%;
  }
`;
const Jumbotron = () => (
  <JumbotronStyles>
    <div className="intro">
      <Header as="h1">Video dịch và thuyết minh bởi cộng đồng</Header>
      <Button primary size="big">
        Thêm Video <Icon name="right arrow" />
      </Button>
    </div>
    <figure>
      <img src="/static/GettyImages-1064233426.jpg" alt="bridge" />
    </figure>
  </JumbotronStyles>
);
export default Jumbotron;
