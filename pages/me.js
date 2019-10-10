import UserProfile from '../components/Authentication/UserProfile';
import PleaseSignIn from '../components/Authentication/PleaseSignIn';

const Me = () => (
  <PleaseSignIn>
    <UserProfile />
  </PleaseSignIn>
);

export default Me;
