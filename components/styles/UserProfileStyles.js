import styled from 'styled-components';

const UserProfileStyles = styled.div`
  .ui.form .inline.fields .field > label {
    width: 91.094px;
    text-align: right;
  }
  .ui.checkbox {
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
    top: 29px;
    left: 257px;
  }
  @media (max-width: 767px) {
    a.ui.label {
      left: 207px;
    }
  }
`;

export default UserProfileStyles;
