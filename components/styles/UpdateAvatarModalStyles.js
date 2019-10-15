import { Modal } from 'semantic-ui-react';
import styled from 'styled-components';

const UpdateAvatarModalStyles = styled(Modal)`
  div.header,
  h3.ui.header,
  h2.ui.top.attached.header {
    font-family: ${props => props.theme.font} !important;
  }
  div.header {
    font-size: 20px !important;
  }
  h2.ui.top.attached.header {
    cursor: pointer;
  }
  .selected {
    border: solid ${props => props.theme.red};
  }
  .uploadImageUrl {
    display: grid;
    grid-template-columns: auto 80px;
    grid-column-gap: 10px;
  }
  .ui.negative.button {
    position: relative;
    top: 25.69px;
    z-index: 1;
  }
  .ui.horizontal.list:not(.celled) > .item:first-child,
  .ui.horizontal.list > .item:last-child,
  .ui.horizontal.list > .item {
    padding: 5px !important;
    width: 90px;
    height: 90px;
  }
`;

export default UpdateAvatarModalStyles;
