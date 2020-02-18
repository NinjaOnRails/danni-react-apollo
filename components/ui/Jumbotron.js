import { Icon, Header, Button } from 'semantic-ui-react';
import Link from 'next/link';
import JumbotronStyles from '../styles/JumbotronStyles';

const Jumbotron = () => (
  <JumbotronStyles>
    <div className="intro">
      <Header as="h1">Community-dubbed video library</Header>
      <Link href="/new">
        <Button primary size="big">
          Add Video <Icon name="right arrow" />
        </Button>
      </Link>
    </div>
    <figure>
      <img src="/static/GettyImages-1064233426.jpg" alt="bridge" />
    </figure>
  </JumbotronStyles>
);
export default Jumbotron;
