import { Header } from 'semantic-ui-react';
import RequestReset from '../components/Authentication/RequestReset';

const RequestResetPage = () => (
  <>
    <Header as="h1" textAlign="center">
      Yêu cầu đổi mật khẩu
    </Header>
    <RequestReset />
  </>
);

export default RequestResetPage;
