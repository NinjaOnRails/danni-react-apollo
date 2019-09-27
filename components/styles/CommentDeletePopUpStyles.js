import styled from 'styled-components';
import { Popup } from 'semantic-ui-react';

export default styled(Popup)`
  && {
    padding: 0;
    background-color: #db2828;
    background: #db2828;
    opacity: 0.9;
    border-radius: 15px;
    &&&&:before {
      background: inherit;
      opacity: 0.9;
    }
  }
`;
