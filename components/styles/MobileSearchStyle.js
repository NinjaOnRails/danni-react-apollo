import styled from 'styled-components';

const MobileSearchStyles = styled.div`
  position: absolute;
  top: 2%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #2f3640;
  height: 20px;
  border-radius: 40px;
  input {
    border: none;
    background: none;
    outline: none;
    float: left;
    padding: 0;
    color: white;
    font-size: 15px;
    transition: 0.4s;
    line-height: 80%;
    width: 0px;
    font-weight: bold;
  }
  &:hover > input {
    width: 140px;
    padding: 0 6px;
  }
  &:hover > a {
    background: white;
    color: black;
  }
  a {
    color: #e84118;
    float: right;
    width: 40px;
    border-radius: 50%;
    background: #2f3640;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.4s;
    color: white;
    cursor: pointer;
  }
  @media (min-width) {
    display: none;
  }
`;

export default MobileSearchStyles;
