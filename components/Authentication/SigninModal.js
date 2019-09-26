import React from 'react';
import { Mutation, Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { CLOSE_SIGNIN_MODAL_MUTATION } from '../../graphql/mutation';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Modal from '../UI/Modal';

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
  render() {
    return (
      <Composed>
        {({ closeSigninModal: closed, localData: { data, loading } }) => {
          const { showSigninModal } = data;
          return <Modal show={showSigninModal} closed={closed} />;
        }}
      </Composed>
    );
  }
}

export default SigninModal;
