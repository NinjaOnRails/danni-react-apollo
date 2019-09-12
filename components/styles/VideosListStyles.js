import styled from 'styled-components';

const VideosListStyles = styled.div`
  font-size: 1.1rem;
  display: grid;
  grid-template-columns: 210px 210px 210px 210px 210px;
  grid-gap: 5px;
  margin: 0 auto;
  justify-content: center;
  padding: 0;
  .ui.card {
    box-shadow: none;
  }
  .ui.large.label {
    position: absolute;
    bottom: 0.2rem;
    right: 0.2rem;
  }

  .ui.card > .content > .header {
    font-family: ${props => props.theme.font};
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; /* Show only first 2 lines */
    line-height: 1.6rem; /* Implement for browsers with no support for webkit */
    max-height: 3.2rem; /* This is line height X no. of lines to show */
  }
  .ui.card > .content > .meta + .description {
    margin-top: 0;
  }
  .ui.placeholder .rectangular.image:not(.header) {
    width: 210px;
    height: 118.13px;
    padding-top: 0;
  }
  @media (max-width: 479px) {
    grid-template-columns: auto;
    .ui.placeholder .rectangular.image:not(.header) {
      width: 320px;
      height: 180px;
    }
  }
  @media (min-width: 480px) {
    grid-template-columns: 210px 210px;
    .ui.card > .content {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  @media (min-width: 720px) {
    grid-template-columns: 210px 210px 210px;
  }
  @media (min-width: 960px) {
    grid-template-columns: 210px 210px 210px 210px;
  }
  @media (min-width: 1280px) {
    grid-template-columns: 210px 210px 210px 210px 210px;
  }
  @media (min-width: 1600px) {
    grid-template-columns: 210px 210px 210px 210px 210px 210px;
  }
  @media (min-width: 1920px) {
    grid-template-columns: 210px 210px 210px 210px 210px 210px 210px;
  }
`;

export default VideosListStyles;