import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';
// import Search from './Search';
// import MobileSearch from './Mobile/MobileSearch';
import Logo from './Logo';
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
      <Logo />
      <Nav />
      {/* <MobileSearch /> */}
    </div>
    {/* <Search /> */}
  </StyledHeader>
);

export default Header;
