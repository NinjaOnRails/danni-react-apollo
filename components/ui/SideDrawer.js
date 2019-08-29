import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Icon, Menu, MenuItem } from 'semantic-ui-react';
import BackDrop from './Backdrop';
import Logo from '../Logo';

const links = [
  { name: 'home', href: '/', alwaysVisible: true, iconName: 'home' },
  { name: 'thêm video', href: '/new', alwaysVisible: true, iconName: 'plus' },
  { name: 'about', href: '/about', alwaysVisible: true, iconName: 'info' },
  { name: 'Đăng Nhập', href: '/signin', isAuth: false, iconName: 'user' },
  { name: 'Đăng Ký', href: '/signup', isAuth: false, iconName: 'user plus' },
  { name: 'Thoát', href: '/signout', isAuth: true, iconName: 'sign-out' },
];

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
    padding-top: 30px;
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
      margin-left: 10px;
    }
    .link-name {
      margin: auto 0 auto 5px;
      text-align: left;
      width: 60%;
      text-transform: uppercase;
      height: 100%;
    }

    .ui.menu .item {
      padding: 7px 0;
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
    <SideDrawerStyles>
      <BackDrop show={show} clicked={closed} />
      <div className={attachedClasses.join(' ')}>
        {/* <Logo inDrawer /> */}
        <div className='links'>
          <Menu vertical icon='labeled' inverted>
            {links.map(({ name, href, iconName }) => (
              <MenuItem as='a' key={name} onClick={closed}>
                <Link href={href}>
                  <div className='link-container'>
                    {href === '/new' ? (
                      <Icon name='icons' size='large'>
                        <Icon name='video' />
                        <Icon name='add black' size='tiny' />
                      </Icon>
                    ) : (
                      <Icon name={iconName} size='large' />
                    )}
                    <span className='link-name'>{name}</span>
                  </div>
                </Link>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>
    </SideDrawerStyles>
  );
};

SideDrawer.propTypes = {
  show: PropTypes.bool.isRequired,
  closed: PropTypes.func.isRequired,
};
export default SideDrawer;
