import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { SIGN_OUT_MUTATION } from '../../Authentication/Signout';
import User, { CURRENT_USER_QUERY } from '../../User';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';

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
