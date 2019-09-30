import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import { adopt } from 'react-adopt';
import Header from './Header';
import SideDrawer from './Mobile/SideDrawer';
import AuthModal, { localData } from '../Authentication/AuthModal';

const theme = {
  red: '#FF0000',
  black: '#393939',
  grey: '#3A3A3A',
  lightgrey: '#E1E1E1',
  offWhite: '#EDEDED',
  maxWidth: '1000px',
  bs: '0 12px 24px 0 rgba(0, 0, 0, 0.09)',
  font: 'Roboto',
};

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`;

const Inner = styled.div`
  /* max-width: ${props => props.theme.maxWidth};
  margin: 0 auto; */
  padding-top: 2rem;
  padding-bottom: 2rem;
  @media (max-width: 479px) {
    padding: 0;
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
    font-size: 1.5rem;
    line-height: 2;
    font-family: ${props => props.theme.font};
    overflow: ${props =>
      props.showSide || props.showAuthModal ? 'hidden' : 'scroll'};
  }
  
  a {
    text-decoration: none;
    color: ${theme.black};
    font-family: "Verdana";
  }
  button {  font-family: "Verdana"; }
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
            <ThemeProvider theme={theme}>
              <StyledPage>
                <GlobalStyle showSide={data.showSide} showAuthModal={data.showAuthModal} />
                <Header />
                <SideDrawer />
                <AuthModal />
                <Inner>{children}</Inner>
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
