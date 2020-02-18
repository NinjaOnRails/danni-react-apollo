import { Header } from 'semantic-ui-react';
import Me from '../components/Authentication/Me';
import PleaseSignIn from '../components/Authentication/PleaseSignIn';

const MePage = () => (
  <>
    <Header as="h1" textAlign="center">
      My Account
    </Header>
    <PleaseSignIn>
      <Me />
    </PleaseSignIn>
  </>
);

export default MePage;
