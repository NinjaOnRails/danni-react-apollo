import styled from 'styled-components';
import NProgress from 'nprogress';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Nav from './Nav';
// import MobileNav from './MobileNav';
import Search from './Search';
import Logo from './Logo';
import MobileSearch from './Mobile/MobileSearch';
import DrawerToggle from './Mobile/DrawerToggle';

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const TOGGLE_SIDEDRAWER_MUTATION = gql`
  mutation {
    toggleSideDrawer @client
  }
`;

const StyledHeader = styled.header`
  /* z-index: 99;
  position: sticky;
  top: 0; */
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

const Header = () => (
  <StyledHeader>
    <div className='bar'>
      <Logo />
      <Nav />
      <Mutation mutation={TOGGLE_SIDEDRAWER_MUTATION}>
        {toggleSideDrawer => <DrawerToggle clicked={toggleSideDrawer} />}
      </Mutation>
      {/* <MobileSearch /> */}
    </div>
    {/* <Search /> */}
  </StyledHeader>
);



export default Header;
export { TOGGLE_SIDEDRAWER_MUTATION };
