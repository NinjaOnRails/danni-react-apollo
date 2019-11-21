import { Menu, Icon } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import styled from 'styled-components';
import DrawerToggle from './DrawerToggle';
import { TOGGLE_SIDEDRAWER_MUTATION } from '../../../graphql/mutation';

const StyledNav = styled.div`
  overflow: hidden;
  /* background-color: #333; */
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  width: 100%;
  z-index: 2;
  border-top: 1px solid grey;
  .ui.menu {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
  .ui.labeled.icon.menu .item {
    margin: auto;
  }
  i.large.icon,
  i.large.icons {
    margin: 0 auto 0.5rem;
    font-size: 1.71428571em;
  }

  @media (min-width: 639px) {
    display: none;
  }
`;

const sidebarItems = [
  { linkName: 'Trang Chủ', link: '/', icon: 'home' },
  { linkName: 'Thêm Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'Tài Khoản', link: '/me', icon: 'user' },
  { linkName: 'Giới Thiệu', link: '/about', icon: 'info' },
];

const MobileNav = () => {
  const activeItem = 'home';

  return (
    <StyledNav>
      <Menu icon="labeled" borderless>
        {sidebarItems.map(({ linkName, link, icon, miniIcon }) => (
          <Link href={link} key={icon}>
            <Menu.Item name={icon} active={activeItem === icon}>
              <Icon.Group size="large">
                <Icon name={icon} />
                {miniIcon && <Icon color="grey" name="plus" size="tiny" />}
              </Icon.Group>

              {linkName}
            </Menu.Item>
          </Link>
        ))}
        <Menu.Item>
          <Mutation mutation={TOGGLE_SIDEDRAWER_MUTATION}>
            {toggleSideDrawer => <DrawerToggle clicked={toggleSideDrawer} />}
          </Mutation>
          Menu
        </Menu.Item>
      </Menu>
    </StyledNav>
  );
};

export default MobileNav;
