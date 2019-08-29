import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { SIGN_OUT_MUTATION } from '../Signout';
import User, { CURRENT_USER_QUERY } from '../User';
import BackDrop from './Backdrop';
import Logo from '../Logo';

const SideDrawerStyles = styled.div`
  .SideDrawer {
    position: fixed;
    width: 40%;
    max-width: 70%;
    height: 100%;
    right: 0;
    top: 0;
    z-index: 200;
    background-color: #1b1c1d /*rgb(35, 35, 35, 0.9)*/;
    box-sizing: border-box;
    transition: transform 0.3s ease-out;
  }
  .links {
    /* border-top: solid 4px white; */
    .ui.vertical.icon.menu {
      width: 100%;
    }
    .link-container {
      display: flex;
      margin-left: 1.5rem;
      align-items: center;
    }
    .link-name {
      margin-left: 2rem;
      text-align: left;
      width: 60%;
      text-transform: uppercase;
      height: 100%;
      font-size: 1rem;
    }

    .ui.menu .item {
      padding: 2rem 0;
      width: 100%;
    }
  }
  .Open {
    transform: translateX(0);
  }
  .Close {
    transform: translateX(100%);
  }
  @media (min-width: 640px) {
    .SideDrawer {
      display: none;
    }
  }
`;

const SideDrawer = ({ show, closed }) => {
  let attachedClasses = ['SideDrawer', 'Close'];
  if (show) {
    attachedClasses = ['SideDrawer', 'Open'];
  }

  return (
    <User>
      {({ data }) => {
        const currentUser = data ? data.currentUser : null;
        return (
          <SideDrawerStyles>
            <BackDrop show={show} clicked={closed} />
            <div className={attachedClasses.join(' ')}>
              {/* <Logo inDrawer /> */}
              <div className="links">
                <Menu vertical icon="labeled" inverted>
                  <MenuItem as="a" onClick={closed}>
                    <Link href="/">
                      <div className="link-container">
                        <Icon name="home" size="large" />
                        <span className="link-name">Trang Chủ</span>
                      </div>
                    </Link>
                  </MenuItem>
                  <MenuItem as="a" onClick={closed}>
                    <Link href="/new">
                      <div className="link-container">
                        <Icon.Group size="large">
                          <Icon name="video" />
                          <Icon color="black" name="plus" size="tiny" />
                        </Icon.Group>
                        <span className="link-name">Thêm Video</span>
                      </div>
                    </Link>
                  </MenuItem>
                  <MenuItem as="a" onClick={closed}>
                    <Link href="/about">
                      <div className="link-container">
                        <Icon name="info" size="large" />
                        <span className="link-name">About</span>
                      </div>
                    </Link>
                  </MenuItem>
                  {!currentUser && (
                    <>
                      <MenuItem as="a" onClick={closed}>
                        <Link href="/signin">
                          <div className="link-container">
                            <Icon name="user" size="large" />
                            <span className="link-name">Đăng Nhập</span>
                          </div>
                        </Link>
                      </MenuItem>
                      <MenuItem as="a" onClick={closed}>
                        <Link href="/signup">
                          <div className="link-container">
                            <Icon name="user plus" size="large" />
                            <span className="link-name">Đăng Ký</span>
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
                          as="a"
                          onClick={() => {
                            signout();
                            closed();
                          }}
                        >
                          <Link href="/">
                            <div className="link-container">
                              <Icon name="sign-out" size="large" />
                              <span className="link-name">Thoát</span>
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
};

SideDrawer.propTypes = {
  show: PropTypes.bool.isRequired,
  closed: PropTypes.func.isRequired,
};

export default SideDrawer;
