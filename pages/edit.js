import EditVideo from '../components/EditVideo';

const Edit = ({ query }) => (
  <div>
    <EditVideo id={query.id} password={query.password} />
  </div>
);

export default Edit;
