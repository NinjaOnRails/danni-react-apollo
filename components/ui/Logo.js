import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import propTypes from 'prop-types';

const LogoStyles = styled.h2`
  font-size: 3rem;
  margin-left: ${props => (props.footer ? '0' : '2rem')};
  position: relative;
  transform: skew(-7deg);
  width: auto;
  justify-content: start;
  display: inline-block;
  
  /* ${props => (props.footer ? 'inline-block' : 'grid')}; */
  /* padding: ${props => (props.footer ? 'block' : 'grid')} */
  background-color: ${props => props.theme.red};
  a {
    padding: 0.5rem 1rem;
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    background-color: ${props => props.theme.red};
  }
  i.icon {
    margin: 0;
  }
  @media (max-width: 1279px) {
    font-size: 2.5rem;
  }
  @media (max-width: 959px) {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 2rem;
  }
  @media (max-width: 639px) {
    font-size:  2.5rem;
    /* transform: ${props => (props.footer ? 'skew(-7deg)' : 'none')}; */
    margin: 0;
    background-color: ${props => props.theme.red}
  }
`;

const Logo = ({ footer }) => (
  <LogoStyles footer={footer}>
    <Link href="/">
      <a>danni.tv</a>
    </Link>
  </LogoStyles>
);

Logo.defaultProps = {
  footer: false,
};

Logo.propTypes = {
  footer: propTypes.bool,
};

export default Logo;
