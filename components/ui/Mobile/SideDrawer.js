import React from 'react';
import Link from 'next/link';
import { Icon, Menu, MenuItem, Button } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import { onSignout } from '../../Authentication/Signout';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';
import ContentLanguage, {
  client,
  user,
  contentLanguageQuery,
} from '../ContentLanguage';
import {
  SIGN_OUT_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
} from '../../../graphql/mutation';
import {
  facebookLoginMutation,
  onFacebookLoginClick,
} from '../../Authentication/Signin';
import { localData } from '../../Authentication/AuthModal';
import { openAuthModal } from '../../Authentication/PleaseSignIn';

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
const signout = ({ render }) => (
  <Mutation mutation={SIGN_OUT_MUTATION}>{render}</Mutation>
);

const closeSideDrawer = ({ render }) => (
  <Mutation mutation={CLOSE_SIDEDRAWER_MUTATION}>{render}</Mutation>
);
/* eslint-enable */

const Composed = adopt({
  closeSideDrawer,
  localData,
  signout,
  client,
  user,
  facebookLoginMutation,
  contentLanguageQuery,
  openAuthModal,
});

const SideDrawer = () => {
  return (
    <Composed>
      {({
        closeSideDrawer,
        localData: { data },
        user: { currentUser },
        client,
        signout,
        facebookLoginMutation: {
          facebookLogin,
          facebookLoginResult: { error: fbLoginError, loading: fbLoginLoading },
        },
        contentLanguageQuery: { contentLanguage },
        openAuthModal,
      }) => (
        <SideDrawerStyles>
          <BackDrop clicked={closeSideDrawer} show={data.showSide} />
          <div className={`SideDrawer ${data.showSide ? 'Open' : 'Close'}`}>
            {/* <Logo inDrawer /> */}
            <div className="links">
              <Menu vertical icon="labeled" inverted>
                <Link href="/">
                  <MenuItem as="a" onClick={closeSideDrawer}>
                    <div className="link-container">
                      <Icon name="home" size="large" />
                      <span className="link-name">Trang Chủ</span>
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
                      <span className="link-name">Thêm Video</span>
                    </div>
                  </MenuItem>
                </Link>
                <Link href="/about">
                  <MenuItem as="a" onClick={closeSideDrawer}>
                    <div className="link-container">
                      <Icon name="info" size="large" />
                      <span className="link-name">Giới Thiệu</span>
                    </div>
                  </MenuItem>
                </Link>
                <MenuItem
                  as="a"
                  onClick={() => {
                    closeSideDrawer();
                    if (!currentUser) openAuthModal();
                  }}
                >
                  <div className="link-container">
                    <Icon name="user" size="large" />
                    <span className="link-name">Tài Khoản</span>
                  </div>
                </MenuItem>
                {!currentUser && (
                  <>
                    <Button
                      type="button"
                      color="facebook"
                      onClick={() =>
                        onFacebookLoginClick({
                          facebookLogin,
                          contentLanguage,
                          client,
                          data,
                          closeSideDrawer,
                        })
                      }
                    >
                      <Icon name="facebook" /> Dùng Facebook
                    </Button>
                  </>
                )}
                {currentUser && (
                  <MenuItem
                    as="a"
                    onClick={() => onSignout({ signout, client })}
                  >
                    <div className="link-container">
                      <Icon name="sign-out" size="large" />
                      <span className="link-name">Đăng Xuất</span>
                    </div>
                  </MenuItem>
                )}
              </Menu>
              <LanguageMenuStyles>
                <ContentLanguage sideDrawer loadingData={false} />
              </LanguageMenuStyles>
            </div>
          </div>
        </SideDrawerStyles>
      )}
    </Composed>
  );
};

export default SideDrawer;
