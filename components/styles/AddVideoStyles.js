import styled from 'styled-components';

export default styled.div`
  max-width: 600px;
  margin: 0 auto;

  .ui.steps .step .title {
    font-family: ${props => props.theme.font};
  }

  form.ui.form {
    height: ${props => (props.editVideo ? 'auto' : '525.69px')};
    @media (max-width: 375px) {
      height: ${props => (props.editVideo ? 'auto' : '400px')};
    }
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

  .youtube-player {
    position: relative;
    padding-top: 56.25% /* Player ratio: 100 / (1280 / 720) */;
    margin: 20px;

    .react-player {
      position: absolute;
      top: 0;
      left: 0;
    }
  }

  .ui.form .warning.message {
    display: block;
  }

  .submit-edit-button {
    margin: auto;
  }
`;
