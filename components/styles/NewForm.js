import styled from 'styled-components';

const StyledForm = styled.form`
margin: 0;
width: 100%;
fieldset{
  border: none;
  width: 100%;
  margin:0;
  padding: 0;
}
.auth-input {
  margin: 0 16px 8px;
  position: relative;
}
input {
  /* background-color: #fff;
  border: 1px solid #fff;
  border-radius: 4px; */
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  color: #000;
  font-size: 16px;
  height: 48px;
  padding: 22px 36px 10px 12px;
  width: 100%;
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
    font-size: 2rem;
   font-weight: 600;
   padding: 0.5rem 1.2rem;
   /* margin-top: ${props => (props.modal ? '1rem' : 0)}; */
margin: 0 auto 15px auto;
   border-radius: 0.28571429rem;
 }
 .center {
   margin-top:10px;
   text-align: center;
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
  /* color: #fff; */
  color: #000;
}

`;

export default StyledForm;
