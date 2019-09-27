import { Tab } from 'semantic-ui-react';
import styled from 'styled-components';

const StyledTab = styled(Tab)`
  .ui.center.aligned.header {
    margin: 10px 0 0 0;
  }
  label {
    text-align: left;
  }
  .ui.grid > .column:not(.row) {
    padding: 16px 16px 0 16px;
  }
  .ui.tabular.menu .active.item {
    font-family: ${props => props.theme.font};
    display: block;
  }
  .ui.menu {
    font-size: 1.5rem;
  }
  .ui.tabular.menu {
    border-bottom: none;
    text-align: center;
  }
  .ui.tabular.menu .item {
    background: lightgrey;
    color: grey;
    border: none;
    width: 50%;
    justify-content: center;
    border-radius: 0 !important;
  }
  .ui.tabular.menu .active.item {
    background: white;
    color: ${props => props.theme.black};
    border-top: 3px solid ${props => props.theme.red};
    border-radius: 0 !important;
  }
`;

export default StyledTab;