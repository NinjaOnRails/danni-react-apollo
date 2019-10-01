import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import Logo from '../UI/Logo';
import { Query } from 'react-apollo';
import { adopt } from 'react-adopt';
import { LOCAL_STATE_QUERY } from '../../graphql/query';
import Signin, { closeAuthModal } from './Signin';
import { user } from '../UI/ContentLanguage';

const StyledModal = styled.div`
.Modal{
  position: fixed;
    z-index: 500;
    background-color: #ffffff;
    width: 100vw;
    height: 100vh;
bottom: 0;
    overflow-y: scroll;
    /* padding: 0 0 16px 0;
    left: 15%;
    top: 20%; */
    /* box-sizing: border-box;
    transition: all 0.3s ease-out;
    transform: ${props =>
      props.show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: ${props => (props.show ? 1 : 0)};
    border-radius: 0.28571429rem; */
}
`;

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

const FullModal = () => (
  <Composed>
    {({
      closeAuthModal,
      localData: {
        data: { showAuthModal },
      },
      user: { currentUser },
    }) => {
      return (
        <StyledModal show={showAuthModal}>
          <div className="Modal">
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
            <Logo />
            <Signin modal />
          </div>
        </StyledModal>
      );
    }}
  </Composed>
);

export default FullModal;
