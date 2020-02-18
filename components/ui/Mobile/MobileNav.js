import { Menu, Icon } from 'semantic-ui-react';
import Link from 'next/link';
import { useOpenSideDrawerMutation } from '../uiHooks';
import { StyledNav } from '../../styles/MobileUiStyles';

const sidebarItems = [
  { linkName: 'Home', link: '/', icon: 'home' },
  { linkName: 'Add Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'Account', link: '/me', icon: 'user' },
  { linkName: 'About us', link: '/about', icon: 'info' },
];

const MobileNav = () => {
  const [openSideDrawer] = useOpenSideDrawerMutation();
  return (
    <StyledNav>
      <Menu icon="labeled" borderless>
        {sidebarItems.map(({ linkName, link, icon, miniIcon }) => (
          <Link href={link} key={icon}>
            <Menu.Item name={icon}>
              <Icon.Group size="large">
                <Icon name={icon} />
                {miniIcon && <Icon color="grey" name="plus" size="tiny" />}
              </Icon.Group>

              {linkName}
            </Menu.Item>
          </Link>
        ))}

        <Menu.Item onClick={openSideDrawer}>
          <Icon name="bars" size="large" />
          Menu
        </Menu.Item>
      </Menu>
    </StyledNav>
  );
};

export default MobileNav;
