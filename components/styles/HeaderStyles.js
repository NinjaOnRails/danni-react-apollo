import styled from 'styled-components';

const StyledHeader = styled.header`
  .bar {
    border-bottom: 10px solid ${props => props.theme.black};
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background-color: white;
  }

  @media (max-width: 639px) {
    z-index: 99;
    .bar {
      grid-template-columns: auto;
      justify-content: center;
      grid-auto-flow: column;
      border-bottom: 2px solid ${props => props.theme.grey};
      height: 35px;
    }
  }
`;

export default StyledHeader;
