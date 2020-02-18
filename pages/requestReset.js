import { Header } from 'semantic-ui-react';
import RequestReset from '../components/Authentication/RequestReset';

const RequestResetPage = () => (
  <>
    <Header as="h1" textAlign="center">
      Request password reset
    </Header>
    <RequestReset />
  </>
);

export default RequestResetPage;
