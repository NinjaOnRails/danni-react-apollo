import { Header } from 'semantic-ui-react';
import AddVideo from '../components/Video/AddVideo';
import PleaseSignIn from '../components/Authentication/PleaseSignIn';

const New = () => (
  <>
    <Header as="h1" textAlign="center">
      Add Video/Dubbing
    </Header>
    <PleaseSignIn>
      <AddVideo />
    </PleaseSignIn>
  </>
);

export default New;
