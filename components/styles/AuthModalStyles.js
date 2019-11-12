import styled from 'styled-components';

const StyledModal = styled.div`
  .Modal {
    position: fixed;
    z-index: 500;
    width: 35%;
    left: 32.5%;
    top: 15%;
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
    background-color: ${props => props.theme.white};
    align-items: center;
    display: flex;
    flex-flow: column;
    z-index: 500;
  }
  .auth-section {
    width: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
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
    color: ${props => props.theme.white};
    text-transform: uppercase;
    text-decoration: none;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
  }
  .auth-modes {
    display: flex;
    padding: 10px;
    width: auto;
    margin-top: 20px;
  }
  .auth-mode:last-child {
    margin-left: 10px;
  }
  .auth-mode {
    cursor: pointer;
    background: ${props => props.theme.lightGrey};
    color: ${props => props.theme.grey};
    border-radius: 24px;
    padding: 6px 16px;
    font-weight: 700;
    text-decoration: none;
    font-family: ${props => props.theme.font};
  }
  .auth-mode:hover {
    background-color: #bfbfbf;
  }

  .auth-modes .active {
    background-color: ${props => props.theme.red};
    color: ${props => props.theme.white};
  }
  .auth-modes .active:hover {
    background-color: #cc0000;
  }
  i.large.icon,
  i.large.icons {
    top: -30px;
    position: absolute;
    right: -7.5%;
    font-size: 2em;
    opacity: 1;
    color: ${props => props.theme.lightGrey};
  }
  @media (max-width: 736px) {
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
      padding: 0;
    }
    i.large.icon {
      top: 10px;
      right: 0;
    }
    i.inverted.icon {
      color: ${props => props.theme.grey};
    }
  }
`;

export default StyledModal;
