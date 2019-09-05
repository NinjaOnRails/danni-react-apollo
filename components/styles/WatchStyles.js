import styled from 'styled-components';

export const StyledContainer = styled.div`
  margin: 0 auto;
  max-width: 1366px;
  padding: 0px 24px;
  .filePlayer {
    display: none; /* Hide audio File Player */
  }
  @media (max-width: 760px) {
    padding: 0 1rem;
  }
  @media (max-width: 479px) {
    div.eleven.wide.computer.sixteen.wide.mobile.sixteen.wide.tablet.column {
      padding: 0;
    }
  }
`;

export const YoutubeStyle = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  /* Create element on top of Youtube Player to limit interaction */
  :before {
    content: '';
    position: absolute;
    height: 78%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    /* background: red; */
    @media (min-width: 793px) {
      position: absolute;
      height: 85%;
    }
  }
  .youtube-player {
    position: absolute;
    top: 0;
    left: 0;
  }
  /* @media (max-width: 479px) {
    position: -webkit-sticky;
    position: sticky;
    top: 33px;
    z-index: 98;
  } */
`;
