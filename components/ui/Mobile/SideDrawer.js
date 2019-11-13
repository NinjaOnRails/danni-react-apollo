import React from 'react';
import Link from 'next/link';
import { ApolloConsumer } from 'react-apollo';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import { onSignout } from '../../Authentication/utils';
import { SideDrawerStyles } from '../../styles/MobileUiStyles';
import BackDrop from './Backdrop';
import ContentLanguage from '../ContentLanguage';
import LanguageMenuStyles from '../../styles/LanguageMenuStyles';
import {
  useCurrentUserQuery,
  useLocalStateQuery,
  useSignoutMutation,
} from '../../Authentication/authHooks';
import { useCloseSideDrawerMutation } from '../uiHooks';

const sidebarItems = [
  { linkName: 'Trang Chủ', link: '/', icon: 'home' },
  { linkName: 'Thêm Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'Giới Thiệu', link: '/about', icon: 'info' },
  { linkName: 'Tài Khoản', link: '/me', icon: 'user' },
];

const SideDrawer = () => {
  const [closeSideDrawer] = useCloseSideDrawerMutation();
  const { currentUser } = useCurrentUserQuery();
  const [signout] = useSignoutMutation();
  const { showSide } = useLocalStateQuery();
  return (
    <ApolloConsumer>
      {client => (
        <SideDrawerStyles>
          <BackDrop clicked={closeSideDrawer} show={showSide} />
          <div className={`SideDrawer ${showSide ? 'Open' : 'Close'}`}>
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
    </ApolloConsumer>
  );
};

export default SideDrawer;
