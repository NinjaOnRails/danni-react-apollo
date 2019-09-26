import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import { adopt } from 'react-adopt';
import { onSignout } from '../../Authentication/Signout';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';
import ContentLanguage, { client, user } from '../ContentLanguage';
import {
  SIGN_OUT_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
} from '../../../graphql/mutation';
import { LOCAL_STATE_QUERY } from '../../../graphql/query';

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

const localData = ({ render }) => (
  <Query query={LOCAL_STATE_QUERY}>{render}</Query>
);
/* eslint-enable */

const Composed = adopt({
  closeSideDrawer,
  localData,
  signout,
  client,
  user,
});

const onAuthClick = ({ router, client }) => {
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
        localData: { data, loading },
        user: { currentUser },
        client,
        signout,
      }) => {
        if (loading) return <div />;
        const { showSide: show } = data;
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
                        <span className="link-name">Chúng Tôi</span>
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
                            <span className="link-name">Đăng Nhập</span>
                          </div>
                        </MenuItem>
                      </Link>
                      <Link href="/signup">
                        <MenuItem
                          as="a"
                          onClick={() => {
                            onAuthClick({ router, client });
                            closeSideDrawer();
                          }}
                        >
                          <div className="link-container">
                            <Icon name="user plus" size="large" />
                            <span className="link-name">Đăng Ký</span>
                          </div>
                        </MenuItem>
                      </Link>
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
        );
      }}
    </Composed>
  );
};

export default SideDrawer;
