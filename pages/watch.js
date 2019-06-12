import Watch from '../components/Watch';

const WatchPage = props => (
  <div>
    <Watch id={props.query.id} />
  </div>
);

export default WatchPage;
