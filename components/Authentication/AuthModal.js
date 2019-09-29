import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { Grid, Header, Icon } from 'semantic-ui-react';
import { CLOSE_AUTH_MODAL_MUTATION } from '../../graphql/mutation';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Modal from '../UI/Modal';
import Signin from './Signin';
import Signup from './Signup';
import StyledTab from '../styles/AuthModalTabStyles';
import { user } from '../UI/ContentLanguage';

/* eslint-disable */
const closeAuthModal = ({ render }) => (
  <Mutation mutation={CLOSE_AUTH_MODAL_MUTATION}>{render}</Mutation>
);

const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);

/* eslint-enable */

const Composed = adopt({
  closeAuthModal,
  localData,
  user,
});

class AuthModal extends React.Component {
  renderForm = type => {
    const headerText =
      type === 'login' ? 'Login to your account' : 'Create a new account';
    const render = type === 'login' ? <Signin isModal  /> : <Signup isModal  />;
    return (
      <Grid textAlign="center" verticalAlign="top">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="black" textAlign="center" size="large">
            {headerText}
          </Header>
          {render}
        </Grid.Column>
      </Grid>
    );
  };

  render() {
    return (
      <Composed>
        {({
          closeAuthModal,
          localData: { data, loading },
          user: { currentUser },
        }) => {
          const panes = [
            {
              menuItem: 'Đăng nhập',
              render: () => this.renderForm('login'),
            },
            {
              menuItem: 'Đăng ký',
              render: () => this.renderForm('signup'),
            },
          ];
          return (
            <>
              <Modal
                show={data.showAuthModal && !currentUser}
                closed={closeAuthModal}
              >
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
            </>
          );
        }}
      </Composed>
    );
  }
}

export default AuthModal;
