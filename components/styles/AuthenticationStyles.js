import styled from 'styled-components';
import { Message } from 'semantic-ui-react';

export const StyledMessage = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 24px auto;
  @media (max-width: 480px) {
    margin: 0 auto;
  }
`;

export const StyledHeader = styled(Message.Header)`
  &&& {
    font-family: ${props => props.theme.font};
  }
`;
