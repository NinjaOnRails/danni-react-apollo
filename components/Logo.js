import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const LogoStyles = styled.h1`
  font-size: 4rem;
  margin-left: 2rem;
  position: relative;
  z-index: 2;
  transform: skew(-7deg);
  width: auto;
  justify-content: start;
  display: grid;
  a {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (max-width: 1300px) {
    margin: 0;
    text-align: center;
  }
  @media (max-width: 673px) {
    display: ${props => (props.inDrawer ? '' : 'grid')};
    justify-content: start;
    font-size: 15px;
    transform: none;
  }
`;

const Logo = ({ inDrawer }) => (
  <LogoStyles inDrawer={inDrawer}>
    <Link href='/'>
      <a>danni.tv</a>
    </Link>
  </LogoStyles>
);

export default Logo;
