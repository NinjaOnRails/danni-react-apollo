import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';
// import Search from './Search';
// import MobileSearch from './Mobile/MobileSearch';
import Logo from './Logo';
import DrawerToggle from './Mobile/DrawerToggle';
import StyledHeader from '../styles/HeaderStyles';
import { useToggleContentLanguageMutation } from './uiHooks';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Header = () => {
  const [toggleSideDrawer] = useToggleContentLanguageMutation();
  return (
    <StyledHeader>
      <div className="bar">
        <Logo />
        <Nav />
        <DrawerToggle clicked={toggleSideDrawer} />
        {/* <MobileSearch /> */}
      </div>
      {/* <Search /> */}
    </StyledHeader>
  );
};

export default Header;
