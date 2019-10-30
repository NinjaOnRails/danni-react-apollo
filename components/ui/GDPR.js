import React from 'react';
import styled from 'styled-components';
import { Button, Icon } from 'semantic-ui-react';

const StyledContainer = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  border: 0;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  font-size: 11px;
  background-color: #393939;
  color: #bebebe;
  box-shadow: 0 0 20px 0 #000;
  min-height: 42px;
  position: relative;
  z-index: 1;
  width: 100%;
  padding: 10px;
  .banner {
    position: relative;
    z-index: 301;
    width: 80%;
    margin: auto;
  }

  a {
    color: white;
    text-decoration: underline;
  }

  /* button {
    display: block;
    height: 14px;
    margin-top: -7px;
    position: absolute;
    right: 7px;
    top: 50%;
    width: 14px;
  } */

  .ui.button {
    display: block;
    background-color: #393939;
    color: #bebebe;
    position: absolute;
    right: 0;
    top: 10px;
    padding: 0;
  }

  @media (max-width: 800px) and (min-width: 640px), (min-width: 801px) {
    padding: 10px 0;
    /* min-width: max-content
    .banner {
      max-width: 981px;
      min-width: 100px;
    } */
  }
`;
class GDPR extends React.Component {
  state = {
    open: true,
  };

  closePopUp = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    return (
      <StyledContainer open={open}>
        <div className="banner">
          <div className="text">
            To help personalize content, tailor and measure ads, and provide a
            safer experience, we use cookies. By clicking or navigating the
            site, you agree to allow our collection of information on and off
            Danni.tv through cookies. Learn more, including about available
            controls: <a href="/">Cookies Policy</a>.
          </div>
        </div>
        <Button icon onClick={this.closePopUp}>
          <Icon name="close" size="big" Ï />
        </Button>
      </StyledContainer>
    );
  }
}

export default GDPR;
