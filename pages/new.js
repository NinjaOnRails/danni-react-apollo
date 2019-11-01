import AddVideo from '../components/Video/AddVideo';
import PleaseSignIn from '../components/Authentication/PleaseSignIn';

const New = () => (
  <PleaseSignIn>
    <AddVideo />
  </PleaseSignIn>
);

export default New;
