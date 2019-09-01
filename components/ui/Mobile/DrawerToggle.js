import React from 'react';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { DrawerToggleStyles } from '../../styles/MobileUiStyles';

const DrawerToggle = ({ clicked }) => (
  <DrawerToggleStyles onClick={clicked}>
    <Icon name="bars" size="large" />
  </DrawerToggleStyles>
);

DrawerToggle.propTypes = {
  clicked: PropTypes.func.isRequired,
};

export default DrawerToggle;
