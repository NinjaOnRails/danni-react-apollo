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
  a.ui.label {
    position: relative;
    top: 28.81px;
  }
  @media (max-width: 767px) {
    a.ui.label {
      left: 207px;
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
