import React from 'react';
import Link from 'next/link';
import propTypes from 'prop-types';
import StyledLogo from '../styles/LogoStyles';

const Logo = ({ footer }) => (
  <StyledLogo footer={footer}>
    <Link href="/">
      <a>danni.tv</a>
    </Link>
  </StyledLogo>
);

Logo.defaultProps = {
  footer: false,
};

Logo.propTypes = {
  footer: propTypes.bool,
};

export default Logo;
