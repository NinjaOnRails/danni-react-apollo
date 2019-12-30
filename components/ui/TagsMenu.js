import styled from 'styled-components';
import { Button } from 'semantic-ui-react';

const tags = [
  'education1',
  'health1',
  'science1',
  'wonders1',
  'self-help1',
  'education2',
  'health2',
  'science2',
  'wonders2',
  'self-help2',
  'education3',
  'health3',
  'science3',
  'wonders3',
  'self-help3',
  'education4',
  'health4',
  'science4',
  'wonders4',
  'self-help4',
];

const StyledList = styled.div`
  /* padding: 0 30px; */
  justify-content: center;
  text-align: center;
  font-family: ${props => props.theme.font};

  ul {
    list-style: none;
    width: 50%;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    /* li {
      display: inline-block;
    } */
    /* justify-content: center;
    display: flex; */
  }
`;

const StyledTag = styled.li`
  opacity: 0;
  animation: FadeIn 1s forwards;
  animation-fill-mode: both;
  animation-delay: ${props => (props.i + 1) * 0.15}s;

  @keyframes FadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const TagsMenu = () => (
  <StyledList>
    <h2>Lựa chọn chủ đề:</h2>
    <ul>
      {tags.map((tag, i) => (
        <StyledTag key={tag} i={i}>
          <Button color={tag === 'wonders1' ? 'blue' : 'black'}>#{tag}</Button>
        </StyledTag>
      ))}
    </ul>
  </StyledList>
);

export default TagsMenu;
