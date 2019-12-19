import NProgress from 'nprogress';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import Nav from './Nav';
// import Search from './Search';
// import MobileSearch from './Mobile/MobileSearch';
import MobileNav from './Mobile/MobileNav';
import Logo from './Logo';
import DrawerToggle from './Mobile/DrawerToggle';
import { TOGGLE_SIDEDRAWER_MUTATION } from '../../graphql/mutation';
import StyledHeader from '../styles/HeaderStyles';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Header = () => (
  <StyledHeader>
    <div className="bar">
      {/* <Mutation mutation={TOGGLE_SIDEDRAWER_MUTATION}>
        {toggleSideDrawer => <DrawerToggle clicked={toggleSideDrawer} />}
      </Mutation> */}
      <Logo />
      <Nav />
      {/* <MobileNav /> */}
      {/* <MobileSearch /> */}
    </div>
    {/* <Search /> */}
  </StyledHeader>
);

export default Header;
