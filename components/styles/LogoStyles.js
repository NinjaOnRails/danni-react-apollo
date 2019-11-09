import styled from 'styled-components';

const LogoStyles = styled.h1`
  font-size: 3rem;
  margin-left: ${props => (props.footer ? '0' : '2rem')};
  position: relative;
  z-index: 2;
  transform: skew(-7deg);
  width: auto;
  justify-content: start;
  display: ${props => (props.footer ? 'inline-block' : 'grid')};
  /* padding: ${props => (props.footer ? 'block' : 'grid')} */
  background-color: ${props => props.theme.red};
  a {
    padding: 0.5rem 1rem;
    color: white;
    text-transform: uppercase;
    text-decoration: none;
  }
  i.icon {
    margin: 0;
  }
  @media (max-width: 1279px) {
    font-size: 2.5rem;
  }
  @media (max-width: 959px) {
    margin-left: 1rem;
    margin-right: 1rem;
    font-size: 2rem;
  }
  @media (max-width: 639px) {
    font-size:  ${props => (props.footer ? '2.5rem' : '1.8rem')};
    transform: ${props => (props.footer ? 'skew(-7deg)' : 'none')};
    margin: 0;
    background-color: ${props => props.theme.red}
  }
`;

export default LogoStyles;