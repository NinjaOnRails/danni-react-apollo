import styled from 'styled-components';

export default styled.div`
  margin-bottom: 2rem;
  line-height: 2rem;

  .buttons {
    text-align: right;
    padding-bottom: 10px;
  }

  h1,
  h2,
  h3,
  .ui.statistic > .label,
  .description {
    font-family: ${props => props.theme.font};
    word-break: break-word;
  }

  .fb-share-button {
    float: right;
    cursor: pointer;
  }

  .basic-info {
    margin-top: 10px;
  }

  .views-social {
    display: flex;
    justify-content: space-between;
  }

  .description-preview {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1; /* Show only first 2 lines */
    /* Implement for browsers with no support for webkit */
    max-height: 2rem; /* This is line height X no. of lines to show */
  }

  .ui.statistic > .label {
    font-size: 12px;
    text-transform: none;
  }
`;
