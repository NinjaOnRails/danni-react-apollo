import styled from 'styled-components';

export default styled.div`
  max-width: 600px;
  margin: 0 auto;

  .ui.steps .step .title {
    font-family: ${props => props.theme.font};
  }

  form.ui.form {
    height: 525.69px;
  }

  div.buttons {
    position: absolute;
    right: 0;
    bottom: 0;
  }

  .choose-file-button {
    display: block;
    margin: 0 auto;
  }

  .audioUrl {
    display: grid;
    grid-template-columns: auto 80px;
    grid-column-gap: 10px;
    button {
      position: relative;
      height: 27.56px;
      top: 20.857px;
    }
  }

  .ui.header {
    font-family: ${props => props.theme.font} !important;
  }

  h2.ui.header {
    cursor: pointer;
  }

  .ui.header:not(h1):not(h2):not(h3):not(h4):not(h5):not(h6) {
    text-align: center;
    margin-top: 10px;
  }

  @media (max-width: 567px) {
    .ui.fluid.steps {
      display: none;
    }
  }
`;
