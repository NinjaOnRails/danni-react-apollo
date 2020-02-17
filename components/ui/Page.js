import React from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
// import Header from './Header';
import Header from './Header';
import Footer, { pagesWithoutFooter } from './Footer';
import SideDrawer from './Mobile/SideDrawer';
import AuthModal from '../Authentication/AuthModal';
import GDPR from './GDPR';
import MobileNav from './Mobile/MobileNav';
import { useLocalStateQuery } from '../Authentication/authHooks';

const defaultTheme = {
  white: ' #fff',
  pureBlack: '#000',
  black: '#393939',
  darkGrey: '#1b1c1d',
  grey: '#808080',
  lightGrey: '#E1E1E1',
  red: '#FF0000',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  font: 'Roboto',
};

const StyledPage = styled.div`
  background-color: white;
  color: ${props => props.theme.black};
  position: relative;
  min-height: 100vh;
`;

const Inner = styled.div`
  margin: auto;
  padding: 3.5rem 0;

  h1.ui.header {
    font-family: ${props => props.theme.font};
  }

  @media (max-width: 991px) {
    padding-top: ${({ route }) => (route === '/watch' ? 0 : '3.5rem')};
  }

  @media (max-width: 720px) {
    padding-top: ${({ route }) =>
      route === '/' || route === '/watch' ? 0 : '3.5rem'};
  }

  @media (max-width: 639px) {
    padding-bottom: 4.5rem;
  }
`;

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    width: 100%;
    font-size: 1.5rem;
    line-height: 2;
    font-family: ${props => props.theme.font};
    overflow: ${props =>
      props.showSide || props.showAuthModal ? 'hidden' : 'scroll'};      
  }
  
  a {
    text-decoration: none;
    color: ${props => props.theme.black};
    font-family: "Verdana";
  }

  button {
    font-family: 'Verdana';
  }

  #chatra.chatra--mobile-widget:not(.chatra--expanded) {
    bottom: 50px !important;
  }
`;

const Page = ({ children, route }) => {
  const { showSide, showAuthModal } = useLocalStateQuery();

  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledPage>
        <GlobalStyle showSide={showSide} showAuthModal={showAuthModal} />
        {/* <GDPR /> */}
        <Header />
        <SideDrawer />
        {showAuthModal && <AuthModal showAuthModal={showAuthModal} />}
        <Inner route={route}>{children}</Inner>
        <MobileNav />
        {!pagesWithoutFooter.includes(route) && <Footer />}
      </StyledPage>
    </ThemeProvider>
  );
};

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  route: PropTypes.string.isRequired,
};

Page.defaultProps = {
  children: null,
};

export default Page;
