import Link from 'next/link';
import styled from 'styled-components';
import NProgress from 'nprogress';
import Router from 'next/router';
import Nav from './Nav';
import MobileNav from './MobileNav';
import Search from './Search';
import MobileSearch from './MobileSearch';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Logo = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-7deg);

  a {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 1279px) {
    margin: 0;
    text-align: center;
  }
  @media (max-width: 639px) {
    display: none;
    /* display: grid;
    justify-content: start;
    font-size: 15px;
    transform: none; */
  }
`;

const StyledHeader = styled.header`
  z-index: 99;
  top: 0;
  position: sticky;
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background-color: white;

    @media (max-width: 1279px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
    @media (max-width: 639px) {
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

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>danni.tv</a>
        </Link>
      </Logo>
      <Nav />
      {/* <MobileSearch /> */}
      <MobileNav />
    </div>
    {/* <Search /> */}
  </StyledHeader>
);

export default Header;
