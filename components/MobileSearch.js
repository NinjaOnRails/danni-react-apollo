import React from 'react';
import { Icon } from 'semantic-ui-react';
import MobileSearchStyles from './styles/MobileSearchStyle';

const MobileSearch = () => (
  <MobileSearchStyles>
    <input type='text' placeholder='Search'/>
    <a>
      <Icon name='search' size='small' />
    </a>
  </MobileSearchStyles>
);

export default MobileSearch;
