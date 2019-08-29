import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const DrawerToggleStyles = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: auto 0;
  @media (min-width: 640px) {
    display: none;
  }
`;

const DrawerToggle = ({ clicked }) => (
  <DrawerToggleStyles onClick={clicked}>
    <Icon name='bars' size='large' />
  </DrawerToggleStyles>
);

DrawerToggle.propTypes = {
  clicked: PropTypes.func.isRequired,
};

export default DrawerToggle;
