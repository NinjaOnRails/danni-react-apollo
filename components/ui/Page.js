import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Header from './Header';
import Footer from './Footer';
import SideDrawer from './Mobile/SideDrawer';
import AuthModal, { localData } from '../Authentication/AuthModal';
import GDPR from './GDPR';

const defaultTheme = {
  white: ' #fff',
  offWhite: '#EDEDED',
  pureBlack: '#000',
  black: '#393939',
  lightBlack: '#1b1c1d',
  grey: '#808080',
  lightGrey: '#E1E1E1',
  red: '#FF0000',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  font: 'Roboto',
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
  position: relative;
`;

const Inner = styled.div`
  padding: 24px 0 10% 0;
  margin: auto;

  @media (max-width: 479px) {
    padding: 0;
    padding-bottom: 10%;
    width: 100%;
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
    height: 100%;
    font-size: 1.5rem;
    line-height: 2;
    font-family: ${props => props.theme.font};
    overflow: ${props =>
      props.showSide || props.showAuthModal ? 'hidden' : 'scroll'};
      /* position: relative; */
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
