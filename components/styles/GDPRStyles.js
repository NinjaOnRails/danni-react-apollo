import styled from 'styled-components';

const StyledContainer = styled.div`
  display: ${props => (props.open ? 'block' : 'none')};
  border: 0;
  -webkit-font-smoothing: antialiased;
  text-align: center;
  font-size: 11px;
  background-color: ${props => props.theme.black};
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
    color: ${props => props.theme.white};
    text-decoration: underline;
  }

  .ui.button {
    display: block;
    background-color: ${props => props.theme.black};
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

export default StyledContainer;
