import { Header } from 'semantic-ui-react';
import EditVideo from '../components/Video/EditVideo';
import PleaseSignIn from '../components/Authentication/PleaseSignIn';

const Edit = ({ id, audioId }) => (
  <>
    <Header as="h1" textAlign="center">
      Chỉnh sửa video
    </Header>
    <PleaseSignIn>
      <EditVideo id={id} audioId={audioId} />
    </PleaseSignIn>
  </>
);

Edit.getInitialProps = ({ query: { id, audioId } }) => {
  return { id, audioId };
};

export default Edit;
