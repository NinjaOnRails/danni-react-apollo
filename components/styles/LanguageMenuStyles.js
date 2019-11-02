import styled from 'styled-components';

const LanguageMenuStyles = styled.div`
  button.ui.button {
    font-family: Verdana;
    text-align: left;
  }
  .ui.basic.buttons .button {
    font-size: 10px;
    color: #fff !important;
  }
  /* Turn off default background color change on hover */
  .ui.basic.buttons .button:hover {
    background-color: transparent !important;
  }
  .ui.toggle.buttons .active.button:hover {
    background-color: #21ba45 !important;
  }
  @media (min-width: 640px) {
    display: none;
  }
`;

export default LanguageMenuStyles;
