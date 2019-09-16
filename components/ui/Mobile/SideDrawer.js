import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation, Query, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import { SIGN_OUT_MUTATION } from '../../Authentication/Signout';
import User, { CURRENT_USER_QUERY } from '../../Authentication/User';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';
import ContentLanguage from '../ContentLanguage';

const CLOSE_SIDEDRAWER_MUTATION = gql`
  mutation {
    closeSideDrawer @client
  }
`;

const LOCAL_STATE_QUERY = gql`
  query {
    showSide @client
  }
`;

const LanguageMenuStyles = styled.div`
  button.ui.button {
    font-family: Verdana;
    text-align: left;
  }
  .ui.basic.buttons .button {
    font-size: 10px;
    color: #fff !important;
  }
  /* Turn off default background color change on hover */
  .ui.basic.buttons .button:hover {
    background-color: transparent !important;
  }
  .ui.toggle.buttons .active.button:hover {
    background-color: #21ba45 !important;
  }
  @media (min-width: 640px) {
    display: none;
  }
`;

/* eslint-disable */
const user = ({ render }) => (
  <User>
    {({ data, loading }) => {
      const currentUser = data ? data.currentUser : null;
      return render({ currentUser, loading });
    }}
  </User>
);

const Composed = adopt({
  closeSideDrawer: ({ render }) => (
    <Mutation mutation={CLOSE_SIDEDRAWER_MUTATION}>{render}</Mutation>
  ),
  localData: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>,
  client: ({ render }) => <ApolloConsumer>{render}</ApolloConsumer>,
  signout: ({ render }) => (
    <Mutation mutation={SIGN_OUT_MUTATION}>{render}</Mutation>
  ),
  user,
});
/* eslint-enable */

const onAuthClick = (router, client) => {
  if (router) {
    const currentPath = router.asPath;
    localStorage.setItem('previousPage', currentPath);
    client.writeData({
      data: { previousPage: currentPath },
    });
  }
};

const SideDrawer = () => {
  const router = useRouter();
  return (
    <Composed>
      {({
        closeSideDrawer,
        localData: {
          data: { showSide: show },
        },
        user: { currentUser },
        client,
        signout,
      }) => (
        <SideDrawerStyles>
          <BackDrop clicked={closeSideDrawer} show={show} />
          <div className={`SideDrawer ${show ? 'Open' : 'Close'}`}>
            {/* <Logo inDrawer /> */}
            <div className="links">
              <Menu vertical icon="labeled" inverted>
                <Link href="/">
                  <MenuItem as="a" onClick={closeSideDrawer}>
                    <div className="link-container">
                      <Icon name="home" size="large" />
                      <span className="link-name">Home</span>
                    </div>
                  </MenuItem>
                </Link>
                <Link href="/new">
                  <MenuItem as="a" onClick={closeSideDrawer}>
                    <div className="link-container">
                      <Icon.Group size="large">
                        <Icon name="video" />
                        <Icon color="black" name="plus" size="tiny" />
                      </Icon.Group>
                      <span className="link-name">Add Video</span>
                    </div>
                  </MenuItem>
                </Link>
                <Link href="/about">
                  <MenuItem as="a" onClick={closeSideDrawer}>
                    <div className="link-container">
                      <Icon name="info" size="large" />
                      <span className="link-name">About</span>
                    </div>
                  </MenuItem>
                </Link>
                {!currentUser && (
                  <>
                    <Link href="/signin">
                      <MenuItem
                        as="a"
                        onClick={() => {
                          onAuthClick(router, client);
                          closeSideDrawer();
                        }}
                      >
                        <div className="link-container">
                          <Icon name="user" size="large" />
                          <span className="link-name">Sign In</span>
                        </div>
                      </MenuItem>
                    </Link>
                    <Link href="/signup">
                      <MenuItem
                        as="a"
                        onClick={() => {
                          onAuthClick(router, client);
                          closeSideDrawer();
                        }}
                      >
                        <div className="link-container">
                          <Icon name="user plus" size="large" />
                          <span className="link-name">Sign Up</span>
                        </div>
                      </MenuItem>
                    </Link>
                  </>
                )}
                {currentUser && (
                  <MenuItem
                    as="a"
                    onClick={async () => {
                      await signout();
                      closeSideDrawer();
                      localStorage.clear();
                      await client.resetStore();
                      client.query({
                        query: CURRENT_USER_QUERY,
                      });
                    }}
                  >
                    <div className="link-container">
                      <Icon name="sign-out" size="large" />
                      <span className="link-name">Sign Out</span>
                    </div>
                  </MenuItem>
                )}
              </Menu>
              <LanguageMenuStyles>
                <ContentLanguage sideDrawer />
              </LanguageMenuStyles>
            </div>
          </div>
        </SideDrawerStyles>
      )}
    </Composed>
  );
};

export default SideDrawer;
export { LOCAL_STATE_QUERY, CLOSE_SIDEDRAWER_MUTATION };
