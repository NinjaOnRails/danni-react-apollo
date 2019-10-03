import styled from 'styled-components';

const StyledModal = styled.div`
  .Modal {
    position: fixed;
    z-index: 500;
    width: 40%;
    left: 30%;
    top: 20%;
    box-sizing: border-box;
    transition: all 0.3s ease-out;
    transform: ${props =>
      props.show ? 'translateY(0)' : 'translateY(-100vh)'};
    opacity: ${props => (props.show ? 1 : 0)};
  }
  .modal-container {
    height: 100%;
    width: 100%;
    border-radius: 16px;
    background-color: #fff;
    align-items: center;
    display: flex;
    flex-flow: column;
    z-index: 500;
  }
  .auth-section {
    width: 100%;
    overflow-y: auto;
  }
  .Logo {
    cursor: default;
    font-size: 3rem;
    position: absolute;
    z-index: 500;
    transform: skew(-7deg);
    width: auto;
    top: -25px;
    padding: 0.5rem 1rem;
    background: ${props => props.theme.red};
    color: white;
    text-transform: uppercase;
    text-decoration: none;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .auth-modes {
    position: initial;
    display: flex;
    padding: 10px;
    width: auto;
    margin-top: 20px;
  }
  .auth-mode:last-child {
    margin-left: 10px;
    margin-top: 0;
  }
  .auth-mode {
    display: block;
    text-align: center;
    margin: auto;
    cursor: pointer;
    background: lightgrey;
    color: grey;
    border-radius: 24px;
    font-size: 1.5rem;
    padding: 6px 16px;
    font-weight: 700;
    text-decoration: none;
    font-family: ${props => props.theme.font};
  }
  .auth-modes .active {
    background-color: ${props => props.theme.red};
    color: #fff;
  }
  i.large.icon,
  i.large.icons {
    top: -10%;
    position: absolute;
    right: -5%;
    font-size: 2em;
  }
  @media (max-width: 639px) {
    .Modal {
      height: 100vh;
      display: flex;
      width: 100%;
      top: 0;
      left: 0;
      max-width: none;
      max-height: none;
      transition: all 0.3s ease-out;
      transform: ${props =>
        props.show ? 'translateY(0)' : 'translateY(-100vh)'};
      opacity: ${props => (props.show ? 1 : 0)};
    }
    .Logo {
      position: initial;
      margin-top: 10px;
    }
    .modal-container {
      border-radius: 0;
      justify-content: normal;
    }
    .auth-modes {
      margin-top: 0;
    }
    i.large.icon {
      top: 10px;
      right: 0;
    }
    i.inverted.icon {
      color: #808080;
    }
  }
`;

export default StyledModal;
