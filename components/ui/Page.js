import PropTypes from 'prop-types';
import { ThemeProvider } from 'styled-components';
import {
  GlobalStyle,
  Inner,
  defaultTheme,
  StyledPage,
} from '../styles/PageStyles';
import Header from './Header';
import Footer, { pagesWithoutFooter } from './Footer';
import SideDrawer from './Mobile/SideDrawer';
// import SideDrawer from './SemanticSidebar';
import AuthModal from '../Authentication/AuthModal';
import GDPR from './GDPR';
import { useLocalStateQuery } from '../Authentication/authHooks';

const Page = ({ children, route }) => {
  const data = useLocalStateQuery();

  if (!data) return <div>Loading...</div>;
  const { showSide, showAuthModal } = data;
  return (
    <ThemeProvider theme={defaultTheme}>
      <StyledPage>
        {/* <SideDrawer> */}
        <GlobalStyle showSide={showSide} showAuthModal={showAuthModal} />
        {/* <GDPR /> */}
        <Header />
        <SideDrawer />
        {showAuthModal && <AuthModal />}
        <Inner route={route}>{children}</Inner>
        {!pagesWithoutFooter.includes(route) && <Footer />}
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
  route: PropTypes.string.isRequired,
};

Page.defaultProps = {
  children: null,
};

export default Page;
