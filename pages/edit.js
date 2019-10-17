import EditVideo from '../components/Video/EditVideo';

const Edit = ({ id, audioId }) => <EditVideo id={id} audioId={audioId} />;

Edit.getInitialProps = ({ query: { id, audioId } }) => {
  return { id, audioId };
};

export default Edit;
