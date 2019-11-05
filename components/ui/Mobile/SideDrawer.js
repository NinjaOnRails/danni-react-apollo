import React from 'react';
import Link from 'next/link';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import { adopt } from 'react-adopt';
import { onSignout } from '../../Authentication/Signout';
import BackDrop from './Backdrop';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';
import ContentLanguage, { client, user } from '../ContentLanguage';
import {
  SIGN_OUT_MUTATION,
  CLOSE_SIDEDRAWER_MUTATION,
} from '../../../graphql/mutation';
import { localData } from '../../Authentication/AuthModal';
import { openAuthModal } from '../../Authentication/PleaseSignIn';
import LanguageMenuStyles from '../../styles/LanguageMenuStyles';
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
  user,
  client,
  signout,
  openAuthModal,
});

const sidebarItems = [
  { linkName: 'Trang Chủ', link: '/', icon: 'home' },
  { linkName: 'Thêm Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'Giới Thiệu', link: '/about', icon: 'info' },
  { linkName: 'Tài Khoản', link: '/me', icon: 'user' },
];

const SideDrawer = () => {
  return (
    <Composed>
      {({
        closeSideDrawer,
        localData: { data },
        user: { currentUser },
        client,
        signout,
        openAuthModal,
      }) => (
        <SideDrawerStyles>
          <BackDrop clicked={closeSideDrawer} show={data.showSide} />
          <div className={`SideDrawer ${data.showSide ? 'Open' : 'Close'}`}>
            {/* <Logo inDrawer /> */}
            <div className="links">
              <Menu vertical icon="labeled" inverted>
                {sidebarItems.map(({ linkName, link, icon, miniIcon }) => (
                  <Link href={link} key={icon}>
                    <MenuItem as="a" onClick={closeSideDrawer}>
                      <div className="link-container">
                        <Icon.Group size="large">
                          <Icon name={icon} />
                          {miniIcon && (
                            <Icon color="black" name="plus" size="tiny" />
                          )}
                        </Icon.Group>
                        <span className="link-name">{linkName}</span>
                      </div>
                    </MenuItem>
                  </Link>
                ))}
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
