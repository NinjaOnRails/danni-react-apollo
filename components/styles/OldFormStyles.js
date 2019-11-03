import styled, { keyframes } from 'styled-components';

const loading = keyframes`
  from {
    background-position: 0 0;
  }
  to {
    background-position: 100% 100%;
  }
`;

const Form = styled.form`
  max-width: ${props => props.theme.maxWidth};
  width: ${props => (props.modal ? '80%' : 'auto')};
  margin: 0 auto;
  box-shadow: ${props =>
    props.modal ? 'none' : '0 0 5px 3px rgba(0, 0, 0, 0.05);'};
  background: ${props =>
    props.modal ? props.theme.white : 'rgba(0, 0, 0, 0.02)'};
  border: ${props => (props.modal ? 'none' : '5px solid white')};
  padding: ${props => (props.modal ? 0 : '20px')};
  font-size: 1.5rem;
  line-height: 1.5;
  font-weight: 600;
  word-break: break-word;
  label,
  input[type='text'],
  input[type='number'],
  a {
    display: block;
    margin-bottom: ${props => (props.modal ? '0.5rem' : '1rem')};
  }
  a {
    font-size: 1rem;
    margin-bottom: 0.1rem;
  }
  textarea {
    resize: none;
  }
  input,
  textarea,
  select {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }
  button,
  input[type='submit'] {
    width: auto;
    background: red;
    color: white;
    border: 0;
    font-size: 1.5rem;
    font-weight: 600;
    padding: 0.5rem 11.36px;
    margin-top: ${props => (props.modal ? '1rem' : 0)};
    margin-bottom: 0.5rem;
    border-radius: 0.28571429rem;
  }
  input[type='radio'],
  input[type='checkbox'] {
    width: auto;
  }
  fieldset {
    border: 0;
    padding: 0;
    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: '';
      display: block;
      background-image: linear-gradient(
        to right,
        #ff3019 0%,
        #e2b04a 50%,
        #ff3019 100%
      );
      margin: ${props => (props.modal ? '0.5rem auto' : '0')};
    }
    &[aria-busy='true']::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
  .ui.facebook.button {
    display: block;
    /* ${props => (props.modal ? 'inline-block' : 'block')}; */
    margin: ${props => (props.modal ? '0 auto 0.75rem auto' : '0 0 1rem 0')};
  }
`;

export default Form;
