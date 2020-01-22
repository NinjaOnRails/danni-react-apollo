import { useState } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { Mutation } from 'react-apollo';
import Link from 'next/link';
import styled from 'styled-components';
import DrawerToggle from './DrawerToggle';
import { TOGGLE_SIDEDRAWER_MUTATION } from '../../../graphql/mutation';

const StyledNav = styled.div`
  .ui.menu {
    width: 100%;
    display: flex;
    justify-content: space-around;
    overflow: hidden;
    background-color: white;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 48px;
    z-index: 2;
    border-top: 1px solid grey;
    border-radius: 0;
    .item {
      padding-right: 0.7em;
      padding-left: 0.7em;
    }
  }
  .ui.labeled.icon.menu .item {
    width: 20%;
  }
  i.large.icon,
  i.large.icons {
    margin: 0 auto 0.5rem;
    font-size: 1.71428571em;
  }

  @media (min-width: 639px) {
    display: none;
  }
  @media (max-width: 361px) {
    .ui.menu .item {
      padding-left: 0;
      padding-right: 0;
    }
  }
`;

const sidebarItems = [
  { linkName: 'Trang Chủ', link: '/', icon: 'home' },
  { linkName: 'Thêm Video', link: '/new', icon: 'video', miniIcon: true },
  { linkName: 'Tài Khoản', link: '/me', icon: 'user' },
  { linkName: 'Giới Thiệu', link: '/about', icon: 'info' },
];

const MobileNav = () => {
  const [activeItem, setActiveItem] = useState('home');

  return (
    <StyledNav>
      <Menu icon="labeled" borderless>
        {sidebarItems.map(({ linkName, link, icon, miniIcon }) => (
          <Link href={link} key={icon}>
            <Menu.Item
              name={icon}
              // active={activeItem === icon}
              // onClick={() => setActiveItem(icon)}
            >
              <Icon.Group size="large">
                <Icon name={icon} />
                {miniIcon && <Icon color="grey" name="plus" size="tiny" />}
              </Icon.Group>

              {linkName}
            </Menu.Item>
          </Link>
        ))}
        <Mutation mutation={TOGGLE_SIDEDRAWER_MUTATION}>
          {toggleSideDrawer => (
            <Menu.Item onClick={toggleSideDrawer}>
              <DrawerToggle clicked={() => {}} />
              Menu
            </Menu.Item>
          )}
        </Mutation>
      </Menu>
    </StyledNav>
  );
};

export default MobileNav;
