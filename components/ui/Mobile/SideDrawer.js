import React from 'react';
import Link from 'next/link';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
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

const SideDrawer = () => {
  return (
    <Mutation mutation={CLOSE_SIDEDRAWER_MUTATION}>
      {closeSideDrawer => (
        <Query query={LOCAL_STATE_QUERY}>
          {({ data, loading }) => {
            if (loading) return <div />;
            const { showSide: show } = data;
            return (
              <User>
                {({ data }) => {
                  const currentUser = data ? data.currentUser : null;
                  return (
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
                                    <Icon
                                      color="black"
                                      name="plus"
                                      size="tiny"
                                    />
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
                                  <MenuItem as="a" onClick={closeSideDrawer}>
                                    <div className="link-container">
                                      <Icon name="user" size="large" />
                                      <span className="link-name">Sign In</span>
                                    </div>
                                  </MenuItem>
                                </Link>
                                <Link href="/signup">
                                  <MenuItem as="a" onClick={closeSideDrawer}>
                                    <div className="link-container">
                                      <Icon name="user plus" size="large" />
                                      <span className="link-name">Sign Up</span>
                                    </div>
                                  </MenuItem>
                                </Link>
                              </>
                            )}
                            {currentUser && (
                              <Mutation
                                mutation={SIGN_OUT_MUTATION}
                                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                              >
                                {signout => (
                                  <Link href="/">
                                    <MenuItem
                                      as="a"
                                      onClick={() => {
                                        signout();
                                        closeSideDrawer();
                                      }}
                                    >
                                      <div className="link-container">
                                        <Icon name="sign-out" size="large" />
                                        <span className="link-name">
                                          Sign Out
                                        </span>
                                      </div>
                                    </MenuItem>
                                  </Link>
                                )}
                              </Mutation>
                            )}
                          </Menu>
                          <LanguageMenuStyles>
                            <ContentLanguage sideDrawer />
                          </LanguageMenuStyles>
                        </div>
                      </div>
                    </SideDrawerStyles>
                  );
                }}
              </User>
            );
          }}
        </Query>
      )}
    </Mutation>
  );
};

export default SideDrawer;
export { LOCAL_STATE_QUERY, CLOSE_SIDEDRAWER_MUTATION };
