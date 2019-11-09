import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Header from './Header';
import Footer from './Footer';
import SideDrawer from './Mobile/SideDrawer';
// import SideDrawer from './SemanticSidebar';
import AuthModal, { localData } from '../Authentication/AuthModal';
import GDPR from './GDPR';

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
  @media (max-width: 991px) {
    width: 100%;
    padding-top: 0;
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
`;

const Composed = adopt({
  localData,
});

class Page extends Component {
  render() {
    const { children } = this.props;
    return (
      <Composed>
        {({ localData: { data } }) => {
          if (!data) return <div>Loading...</div>;
          return (
            <ThemeProvider theme={defaultTheme}>
              <StyledPage>
                {/* <SideDrawer> */}
                <GlobalStyle
                  showSide={data.showSide}
                  showAuthModal={data.showAuthModal}
                />
                {/* <GDPR /> */}
                <Header />
                <SideDrawer />
                {data.showAuthModal && <AuthModal />}
                <Inner>{children}</Inner>
                <Footer />
                {/* </SideDrawer> */}
              </StyledPage>
            </ThemeProvider>
          );
        }}
      </Composed>
    );
  }
}

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
