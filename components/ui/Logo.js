import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const LogoStyles = styled.h1`
  font-size: 3rem;
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
  @media (max-width: 1279px) {
    font-size: 2.5rem;
  }
  @media (max-width: 959px) {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 2rem;
  }
  @media (max-width: 639px) {
    display: grid;
    font-size: 1.5rem;
    transform: none;
    margin: 0;
  }
`;

const Logo = () => (
  <LogoStyles>
    <Link href="/">
      <a>danni.tv</a>
    </Link>
  </LogoStyles>
);

export default Logo;
