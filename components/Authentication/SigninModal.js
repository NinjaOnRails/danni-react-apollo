import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import {
  Form,
  Segment,
  Grid,
  Header,
  Message,
  Button,
} from 'semantic-ui-react';
import Link from 'next/link';
import { CLOSE_SIGNIN_MODAL_MUTATION } from '../../graphql/mutation';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Modal from '../UI/Modal';
import { modalLoginForm, modalSignupForm } from './fieldTypes';
/* eslint-disable */
const closeSigninModal = ({ render }) => (
  <Mutation mutation={CLOSE_SIGNIN_MODAL_MUTATION}>{render}</Mutation>
);

const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);
/* eslint-enable */

const Composed = adopt({
  closeSigninModal,
  localData,
});

class SigninModal extends React.Component {
  state = {
    formMode: 'login',
  };

  onLoginClick = () => {
    this.setState({ formMode: 'login' });
  };

  onSignupClick = () => {
    this.setState({ formMode: 'signup' });
  };

  renderForm = ({ headerText, forms, buttonText }) => {
    return (
      <Grid textAlign="center" verticalAlign="top">
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as="h2" color="teal" textAlign="center">
            {headerText}
          </Header>
          <Form size="large">
            <Segment stacked>
              {forms.map(({ icon, placeholder, type }) => (
                <Form.Input
                  fluid
                  icon={icon}
                  iconPosition="left"
                  placeholder={placeholder}
                  type={type}
                />
              ))}
              <Button color="teal" fluid size="large">
                {buttonText}
              </Button>
            </Segment>
          </Form>
          <Message small>
            <Link href="/requestReset">Forgot your password?</Link>
          </Message>
        </Grid.Column>
      </Grid>
    );
  };

  render() {
    const { formMode } = this.state;
    return (
      <Composed>
        {({ closeSigninModal: closed, localData: { data, loading } }) => {
          const { showSigninModal } = data;
          return (
            <Modal show={showSigninModal} closed={closed}>
              {formMode === 'login'
                ? this.renderForm(modalLoginForm)
                : this.renderForm(modalSignupForm)}
            </Modal>
          );
        }}
      </Composed>
    );
  }
}

export default SigninModal;
