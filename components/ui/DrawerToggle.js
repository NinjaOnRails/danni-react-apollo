import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const DrawerToggleStyles = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: auto 0;
  @media (min-width: 500px) {
    display: none;
  }
`;

const drawToggle = ({ clicked }) => (
  <DrawerToggleStyles onClick={clicked}>
    <Icon name='bars' size='large' />
  </DrawerToggleStyles>
);
export default drawToggle;
