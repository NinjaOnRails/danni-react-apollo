import styled from 'styled-components';
import NProgress from 'nprogress';
import Router from 'next/router';
import PropTypes from 'prop-types';
import Nav from './Nav';
// import MobileNav from './MobileNav';
import Search from './Search';
import Logo from './Logo';
import MobileSearch from './MobileSearch';
import DrawerToggle from './ui/DrawerToggle';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const StyledHeader = styled.header`
  z-index: 99;
  position: sticky;
  top: 0;
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background-color: white;

    @media (max-width: 639px) {
      grid-template-columns: 1fr;
      grid-auto-flow: column;
      border-bottom: 4px solid ${props => props.theme.black};
    }
  }
  .sub-bar {
    display: grid;
    grid-template-columns: 1fr auto;
    border-bottom: 1px solid ${props => props.theme.lightgrey};
  }
`;

const Header = ({ drawerToggleClick }) => (
  <StyledHeader>
    <div className='bar'>
      <Logo />
      <Nav />
      <DrawerToggle clicked={drawerToggleClick} />
      {/* <MobileSearch /> */}
    </div>
    {/* <Search /> */}
  </StyledHeader>
);

Header.propTypes = {
  drawerToggleClick: PropTypes.func.isRequired,
};
<<<<<<< HEAD
=======

>>>>>>> 9525fe2d103edd718100e0e88ce9a3681aea3afb
export default Header;
