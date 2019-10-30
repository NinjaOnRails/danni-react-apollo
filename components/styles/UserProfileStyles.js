import styled from 'styled-components';

const UserProfileStyles = styled.div`
  .ui.form .field .ui.input input,
  .ui.form .fields .field .ui.input input {
    width: 160px;
  }
  .ui.large.form {
    width: 320px;
    text-align: center;
  }
  .ui.form .inline.fields .field {
    padding-right: 7px;
  }
  .ui.image img,
  .ui.image svg {
    border-radius: 0.28571429rem;
  }
  .display-hide-password {
    cursor: pointer;
  }
  .ui.form .inline.fields .field > label {
    width: 80px;
    text-align: right;
    margin-right: 7px;
  }
  div.item {
    justify-content: center;
  }
  .ui.items > .item > .content {
    text-align: center;
    max-width: 350px;
    align-self: center;
    padding-left: 1.5em;
  }
  i.icons .top.left.corner.icon {
    background: #e0e1e2 none;
    border-radius: 0.28571429rem 0 0 0;
  }
  i.icons .top.left.corner.icon:hover {
    background: #cacbcd;
  }
  i.bordered.icon {
    box-shadow: none;
  }
  i.big.icon,
  i.big.icons {
    width: 300px;
    flex: 0 0 auto;
    display: block;
    float: none;
    margin: 0;
    padding: 0;
    max-width: 100%;
    background-color: transparent;
  }
  i.icons .corner.icon {
    font-size: 0.6em;
  }
  @media (max-width: 767px) {
    .ui.items > .item > .content {
      display: block;
      padding: 1.5em 0 0;
    }
    i.big.icon,
    i.big.icons {
      display: block;
      margin-left: auto;
      margin-right: auto;
    }
    .ui.items > .item > .content {
      padding-left: 0;
    }
  }
  @media (max-width: 639px) {
    i.big.icon,
    i.big.icons {
      width: 150px;
    }
    i.icons .corner.icon {
      font-size: 0.5em;
    }
  }
`;

export default UserProfileStyles;
