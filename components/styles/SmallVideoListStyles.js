import styled from 'styled-components';
import { List } from 'semantic-ui-react';

export const SmallVideoListStyles = styled.div`
  padding-top: 24px;
`;

export const VideoItemStyles = styled.div`
  display: flex;
  align-items: top;
  height: 68px;
  cursor: pointer;
  .content {
    padding-left: 0.5rem;
  }
  .ui.image img {
    max-width: 168px;
  }
  .ui.label {
    position: absolute;
    top: 73px;
    right: 0.3rem;
  }
`;

export const ListHeaderStyled = styled(List.Header)`
  &&&& {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-height: 1.8rem;
    max-height: 3.6rem;
    font-size: 1.4rem;
    font-family: ${props => props.theme.font};
  }
`;

export const ListDescriptionStyled = styled(List.Description)`
  font-size: 1.3rem;
  font-family: ${props => props.theme.font};
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 17px;
  max-height: 17px;
`;

export const AuthorStyles = styled.div`
  float: left;
  position: relative;
  top: -1rem;
  left: 17.3rem;
  font-size: 1.3rem;
  max-width: 202.06px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-height: 28px;
  max-height: 28px;
  a {
    font-family: ${props => props.theme.font};
  }
  @media (max-width: 1199px) {
    max-width: 177px;
  }
  @media (max-width: 320px) {
    max-width: 127px;
  }
`;
