import styled from 'styled-components';

const DropdownForm = styled.div`
  .semantic-dropdown.ui.fluid.selection.dropdown {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid black;
    margin-bottom: 1rem;
    &:focus {
      outline: 0;
      border-color: ${props => props.theme.red};
    }
  }
  .text {
    margin: auto;
  }
`;

export default DropdownForm;
