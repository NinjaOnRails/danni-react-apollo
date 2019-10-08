import styled from 'styled-components';

const StyledForm = styled.form`
font-family: ${props => props.theme.font};
  margin: 0;
  width: 100%;
  fieldset {
    border: none;
    width:  ${props => (props.modal ? '100%' : '50%')};
    margin: ${props => (props.modal ? 0 : 'auto')};
    padding: 0;
  }
  .auth-input {
    margin: 0 16px 8px;
    position: relative;
  }
  .auth-input:last-child {
    margin-bottom: 10px;
    background: #ff0000;
  }
  h2 {
  font-family: ${props => props.theme.font};
  }
  input {
    border: none;
    border-bottom: 1px solid #000;
    background-color: transparent;
    color: #000;
    font-size: 16px;
    height: 48px;
    padding: 22px 36px 10px 12px;
    width: 100%;
    /* ${props => (props.modal ? '100%' : '50%')}; */
  }
  .invalid {
    border-bottom: 1px solid red;
  }
  .or {
    margin: 5px 0;
  }
  label {
    color: #818384;
    display: inline-block;
    font-size: 16px;
    left: 11px;
    position: absolute;
    top: 12px;
    transform-origin: 0 50%;
    transition: all 0.2s ease-in-out;
    vertical-align: middle;
    pointer-events: none;
  }
  button {
    width: auto;
    background: red;
    color: white;
    border: 0;
    font-size: 1.8rem;
    font-weight: 600;
    /* margin: ${props => (props.modal ? '10px' : 0)} auto 0 auto; */
    font-size: 1.5rem;
    padding: 0.5rem 11.36px;
    /* margin-bottom: 0.5rem; */
    border-radius: 0.28571429rem;
    cursor: pointer;
  }
  button:hover{
    background: #cc0000;
  }
  button:disabled{
    background: lightgrey;
    color: grey;
  }
  .center {
    text-align: center;
    margin-top: 20px;
  }
  input:focus + label,
  input[data-empty='false'] + label {
    transform: translate3d(0, -15px, 0) scale(0.83);
  }
  .ui.facebook.button {
    display: block;
    margin: 0 auto 0.75rem auto;
  }
  .auth-links {
    color: #fff;
    font-size: 15px;
    padding: 8px;
    text-align: center;
  }
  .auth-links a {
    color: #0079d3;
    display: inline-block;
    width: fit-content;
    margin: 0 10px 10px;
    /* display: block;
    width: fit-content;
    margin:auto; */
  }
  .auth-links a:hover {
    color: #3394dc;
  }
  
  .auth-title {
    color: #000;
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 30px;
    margin: 16px;
    text-align: center;
  }
  @media(max-width: 639px){
    fieldset {
    width:  ${props => (props.modal ? '90%' : '70%')};
    margin: auto
  }
  }
`;

export default StyledForm;
