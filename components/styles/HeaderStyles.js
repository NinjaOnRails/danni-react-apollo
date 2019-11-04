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
    position: sticky;
    top: 0;
    .bar {
      grid-template-columns: auto auto;
      grid-auto-flow: column;
      border-bottom: 4px solid ${props => props.theme.black};
      height: 45px;
    }
  }
`;

export default StyledHeader;
