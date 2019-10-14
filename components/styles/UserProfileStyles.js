import styled from 'styled-components';

const UserProfileStyles = styled.div`
  .ui.form .inline.fields .field > label {
    width: 91.094px;
    text-align: right;
  }
  div.item {
    justify-content: center;
  }
  .ui.items > .item > .image + .content {
    text-align: center;
    max-width: 350px;
  }
  @media (max-width: 767px) {
    .ui.big.icon.button {
      position: relative;
      left: 211px;
      top: 35.34px;
      width: 35.34px;
      z-index: 1;
    }
  }
  .ui.icon.button {
    position: relative;
    height: 35.34px;
    left: 38.5px;
    z-index: 1;
  }
`;

export default UserProfileStyles;
