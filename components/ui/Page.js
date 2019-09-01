import React, { Component } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import PropTypes from 'prop-types';
import Fonts from './Fonts';
import Header from './Header';
import Meta from './Meta';
import SideDrawer from './Mobile/SideDrawer';

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
    overflow: scroll;
  }
  a {
    text-decoration: none;
    color: ${theme.black};
    font-family: "Verdana";
  }
  button {  font-family: "Verdana"; }
`;

class Page extends Component {
  state = {
    showSide: false,
  };

  componentDidMount() {
    Fonts();
  }

  closeSideDrawer() {
    this.setState({ showSide: false });
  }

  drawerToggleClick() {
    this.setState({ showSide: !this.state.showSide });
  }

  render() {
    const { children } = this.props;
    const { showSide } = this.state;
    return (
      <ThemeProvider theme={theme}>
        <StyledPage>
          <GlobalStyle />
          <Meta />
          <Header drawerToggleClick={() => this.drawerToggleClick()} />
          <SideDrawer show={showSide} closed={() => this.closeSideDrawer()} />
          <Inner>{children}</Inner>
        </StyledPage>
      </ThemeProvider>
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
