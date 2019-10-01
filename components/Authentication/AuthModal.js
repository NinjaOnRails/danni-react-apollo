import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { Grid, Header, Icon } from 'semantic-ui-react';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Modal from '../UI/Modal';
import Signin, { closeAuthModal } from './Signin';
import Signup from './Signup';
import StyledTab from '../styles/AuthModalTabStyles';
import { user } from '../UI/ContentLanguage';

/* eslint-disable */
const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);
/* eslint-enable */

const Composed = adopt({
  closeAuthModal,
  localData,
  user,
});

const renderForm = type => {
  const headerText =
    type === 'login' ? 'Đăng nhập để tiếp tục' : 'Tạo tài khoản mới';
  const render =
    type === 'login' ? (
      <Signin modal noRedirect />
    ) : (
      <Signup modal noRedirect />
    );
  return (
    <Grid textAlign="center" verticalAlign="top">
      <Grid.Column>
        <Header as="h2" color="black" textAlign="center" size="medium">
          {headerText}
        </Header>
        {render}
      </Grid.Column>
    </Grid>
  );
};

const AuthModal = () => (
  <Composed>
    {({
      closeAuthModal,
      localData: {
        data: { showAuthModal },
      },
      user: { currentUser },
    }) => {
      const panes = [
        {
          menuItem: 'Đăng nhập',
          render: () => renderForm('login'),
        },
        {
          menuItem: 'Đăng ký',
          render: () => renderForm('signup'),
        },
      ];
      return (
        <Modal show={showAuthModal && !currentUser} close={closeAuthModal}>
          <Icon
            name="close"
            inverted
            link
            size="large"
            style={{
              position: 'absolute',
              top: '-30px',
              left: '95%',
              // display: "inline-block"
            }}
            onClick={closeAuthModal}
          />
          <StyledTab panes={panes} grid={{ paneWidth: 2, tabWidth: 1 }} />
        </Modal>
      );
    }}
  </Composed>
);

export default AuthModal;
export { localData };
