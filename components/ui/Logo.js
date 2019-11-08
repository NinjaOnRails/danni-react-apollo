import React from 'react';
import Link from 'next/link';
import propTypes from 'prop-types';
import LogoStyles from '../styles/LogoStyles';

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
