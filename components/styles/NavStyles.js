import styled from 'styled-components';

const NavStyles = styled.div`
  margin: 0;
  padding: 0;
  display: flex;
  justify-self: end;
  font-size: 2rem;
  a,
  button {
    line-height: normal;
    padding: 1rem 3rem;
    display: flex;
    align-items: center;
    text-align: center;
    position: relative;
    text-transform: uppercase;
    font-weight: 900;
    font-size: 0.7em;
    background: none;
    border: 0;
    cursor: pointer;
    color: ${props => props.theme.black};
    font-weight: 800;
    &:before {
      content: '';
      width: 2px;
      background: ${props => props.theme.lightgrey};
      height: 100%;
      left: 0;
      position: absolute;
      transform: skew(-20deg);
      top: 0;
      bottom: 0;
    }
    &:after {
      height: 2px;
      background: red;
      content: '';
      width: 0;
      position: absolute;
      transform: translateX(-50%);
      /* transition: width 0.4s; */
      transition-property: width;
      transition-duration: 0.4s;
      transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      /* -webkit-transtition: width 0.4s; */
      -webkit-transform: translateX(-50%);
      -webkit-transition-property: width;
      -webkit-transition-duration: 0.4s;
      -webkit-transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
      transform-style: preserve-3d;
      backface-visibility: hidden;
      -webkit-transform-style: preserve-3d;
      -webkit-backface-visibility: hidden;
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
  @media (max-width: 1279px) {
    font-size: 1.5rem;
  }
  @media (max-width: 822px) {
    font-size: 1.2rem;
  }
  @media (max-width: 639px) {
    display: none;
    /* font-size: 1rem;
    width: 100%;
    justify-content: center; */
  }
`;

export default NavStyles;
