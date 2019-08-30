import React from 'react';
import PropTypes from 'prop-types';
import { BackdropStyles } from '../../styles/MobileUiStyles';

const Backdrop = ({ show, clicked }) =>
  show ? <BackdropStyles onClick={clicked} show /> : null;

Backdrop.propTypes = {
  show: PropTypes.bool.isRequired,
  clicked: PropTypes.func.isRequired,
};

export default Backdrop;
