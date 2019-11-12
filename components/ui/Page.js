import React from 'react';
import { ThemeProvider } from 'styled-components';
import PropTypes from 'prop-types';
import {
  GlobalStyle,
  Inner,
  defaultTheme,
  StyledPage,
} from '../styles/PageStyles';
import Header from './Header';
import Footer from './Footer';
import SideDrawer from './Mobile/SideDrawer';
// import SideDrawer from './SemanticSidebar';
import AuthModal from '../Authentication/AuthModal';
import GDPR from './GDPR';
import { useLocalDataQuery } from '../Authentication/authHooks';

const Page = ({ children }) => {
  const {
    data: { showSide, showAuthModal },
  } = useLocalDataQuery;

  if (!showSide || !showAuthModal) return <div>Loading...</div>;
  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledPage>
        {/* <SideDrawer> */}
        <GlobalStyle showSide={showSide} showAuthModal={showAuthModal} />
        {/* <GDPR /> */}
        <Header />
        <SideDrawer />
        {showAuthModal && <AuthModal />}
        <Inner>{children}</Inner>
        <Footer />
        {/* </SideDrawer> */}
      </StyledPage>
    </ThemeProvider>
  );
};

Page.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

Page.defaultProps = {
  children: null,
};

export default Page;
