import styled from 'styled-components';
import NProgress from 'nprogress';
import Router from 'next/router';
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
  /* z-index: 99; */
  position: sticky;
  width: 100%;
  top: 0;
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background-color: white;
    @media (max-width: 1300px) {
      grid-template-columns: 8fr 2fr;
      justify-content: center;
    }
    @media (max-width: 673px) {
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
      {/* <MobileSearch /> */}
      <DrawerToggle clicked={drawerToggleClick} />

      {/* <MobileNav /> */}
    </div>
    <Search />
  </StyledHeader>
);

export default Header;
