import styled from 'styled-components';
import { List } from 'semantic-ui-react';

export const VideoItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  .content {
    padding-left: 0.5rem;
  }
  .ui.image img {
    max-width: 168px;
  }
  .ui.label {
    position: absolute;
    bottom: 0.3rem;
    right: 0.3rem;
  }
`;

export const ListHeaderStyled = styled(List.Header)`
  &&&& {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-height: 1.8rem;
    max-height: 5.4rem;
    font-size: 1.4rem;
    font-family: ${props => props.theme.font};
  }
`;

export const ListDescriptionStyled = styled(List.Description)`
  padding-top: 0.4rem;
  &&&& {
    font-size: 1.3rem;
  }
`;
