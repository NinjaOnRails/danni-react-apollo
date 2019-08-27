import styled from 'styled-components';

const MobileNavStyles = styled.ul`
  display: grid;
  justify-content: end;
  align-content: center;
  box-sizing: border-box;
  z-index: 90;
  margin: 0;
  padding: 0;
  width: 100%;
  i {
    display: grid;
    justify-content: end;
  }
  li {
    float: left;
    list-style: none;
    position: relative;
    text-align: center;
    width: 100%;
  }

  li ul {
    display: none;
    position: absolute;
    background-color: ${props => props.theme.lightgrey};
    opacity: 0.7;
    border-radius: 10px;
    padding: 0;
    list-style-type: none;
    justify-content: center;
    padding: 8px 0;
    width: 150%;
    left: 20%;
    margin-left: -30px;
  }

  li:hover ul {
    display: block;
  }

  li ul li:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  a,
  button {
    display: inline-block;
    align-items: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 10px;
    background: none;
    cursor: pointer;
    color: ${props => props.theme.black};
    font-weight: 800;
    width: 80%;
    height: 100%;
    /* @media (max-width: 700px) {
      font-size: 10px;
      padding: 0 10px;
    } */
    &:after {
      height: 2px;
      background: red;
      content: '';
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      transition: width 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      left: 50%;
      margin-top: 2rem;
    }
    &:hover,
    &:focus {
      outline: none;
      &:after {
        width: calc(100% - 60px);
      }
    }
  }
  .menu {
    border: 0;
    font-size: 0.75em;
    padding: 0;
    margin-right: 15px;
    &:after {
      content: none;
    }
  }
  /* @media (min-width: 676px) { */
    display: none;
  /* } */
`;

export default MobileNavStyles;
