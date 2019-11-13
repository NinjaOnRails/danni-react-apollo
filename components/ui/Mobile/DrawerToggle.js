import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { DrawerToggleStyles } from '../../styles/MobileUiStyles';

const DrawerToggle = ({ onClick }) => (
  <DrawerToggleStyles onClick={onClick}>
    <Icon name="bars" size="large" />
  </DrawerToggleStyles>
);

DrawerToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default DrawerToggle;
