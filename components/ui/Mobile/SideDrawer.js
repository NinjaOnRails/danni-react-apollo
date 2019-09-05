import React from 'react';
import Link from 'next/link';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { SIGN_OUT_MUTATION } from '../../Authentication/Signout';
import User, { CURRENT_USER_QUERY } from '../../Authentication/User';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';

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
const SideDrawer = () => {
  return (
    <Mutation mutation={CLOSE_SIDEDRAWER_MUTATION}>
      {closeSideDrawer => (
        <Query query={LOCAL_STATE_QUERY}>
          {({ data: {showSide: show} }) => {
            return (
              <User>
                {({ data }) => {
                  const currentUser = data ? data.currentUser : null;
                  return (
                    <SideDrawerStyles>
                      <BackDrop clicked={closeSideDrawer} show={show} />
                      <div className={`SideDrawer ${show ? 'Open' : 'Close'}`}>
                        {/* <Logo inDrawer /> */}
                        <div className='links'>
                          <Menu vertical icon='labeled' inverted>
                            <MenuItem as='a' onClick={closeSideDrawer}>
                              <Link href='/'>
                                <div className='link-container'>
                                  <Icon name='home' size='large' />
                                  <span className='link-name'>Home</span>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem as='a' onClick={closeSideDrawer}>
                              <Link href='/new'>
                                <div className='link-container'>
                                  <Icon.Group size='large'>
                                    <Icon name='video' />
                                    <Icon
                                      color='black'
                                      name='plus'
                                      size='tiny'
                                    />
                                  </Icon.Group>
                                  <span className='link-name'>Add Video</span>
                                </div>
                              </Link>
                            </MenuItem>
                            <MenuItem as='a' onClick={closeSideDrawer}>
                              <Link href='/about'>
                                <div className='link-container'>
                                  <Icon name='info' size='large' />
                                  <span className='link-name'>About</span>
                                </div>
                              </Link>
                            </MenuItem>
                            {!currentUser && (
                              <>
                                <MenuItem as='a' onClick={closeSideDrawer}>
                                  <Link href='/signin'>
                                    <div className='link-container'>
                                      <Icon name='user' size='large' />
                                      <span className='link-name'>Sign In</span>
                                    </div>
                                  </Link>
                                </MenuItem>
                                <MenuItem as='a' onClick={closeSideDrawer}>
                                  <Link href='/signup'>
                                    <div className='link-container'>
                                      <Icon name='user plus' size='large' />
                                      <span className='link-name'>Sign Up</span>
                                    </div>
                                  </Link>
                                </MenuItem>
                              </>
                            )}
                            {currentUser && (
                              <Mutation
                                mutation={SIGN_OUT_MUTATION}
                                refetchQueries={[{ query: CURRENT_USER_QUERY }]}
                              >
                                {signout => (
                                  <MenuItem
                                    as='a'
                                    onClick={() => {
                                      signout();
                                      closeSideDrawer();
                                    }}
                                  >
                                    <Link href='/'>
                                      <div className='link-container'>
                                        <Icon name='sign-out' size='large' />
                                        <span className='link-name'>
                                          Sign Out
                                        </span>
                                      </div>
                                    </Link>
                                  </MenuItem>
                                )}
                              </Mutation>
                            )}
                          </Menu>
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
