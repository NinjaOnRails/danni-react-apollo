import styled from 'styled-components';
import { Message } from 'semantic-ui-react';

export const StyledMessage = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 24px auto;
  text-align: center;
  width: 50%;
`;

export const StyledHeader = styled(Message.Header)`
  &&& {
    font-family: ${props => props.theme.font};
  }
`;
