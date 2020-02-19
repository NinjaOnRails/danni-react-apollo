import Link from 'next/link';
import { useApolloClient } from '@apollo/react-hooks';
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
  { linkName: 'Home', link: '/', icon: 'home' },
  { linkName: 'Add Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'About us', link: '/about', icon: 'info' },
  { linkName: 'Account', link: '/me', icon: 'user' },
];

const SideDrawer = () => {
  const [closeSideDrawer] = useCloseSideDrawerMutation();
  const { currentUser } = useCurrentUserQuery();
  const [signout] = useSignoutMutation();
  const { showSide } = useLocalStateQuery();
  const client = useApolloClient();

  return (
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
              <MenuItem as="a" onClick={() => onSignout({ signout, client })}>
                <div className="link-container">
                  <Icon name="sign-out" size="large" />
                  <span className="link-name">Log out</span>
                </div>
              </MenuItem>
            )}
          </Menu>
          <LanguageMenuStyles>
            {/* <ContentLanguage sideDrawer loadingData={false} /> */}
          </LanguageMenuStyles>
        </div>
      </div>
    </SideDrawerStyles>
  );
};

export default SideDrawer;
