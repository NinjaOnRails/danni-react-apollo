import styled from 'styled-components';

export const WatchPageStyles = styled.div`
  display: grid;
  .filePlayer {
    display: none; /* Hide audio File Player */
  }
  @media (max-width: 991px) {
    .tablet-padding {
      padding: 0 1rem;
    }
  }
  @media (min-width: 992px) {
    grid-template-columns: auto 350px;
    margin: 0 1rem;
    .main {
      padding-right: 1rem;
    }
  }
  @media (min-width: 1200px) {
    grid-template-columns: auto 402px;
    .main {
      padding-right: 24px;
    }
    margin: 0 24px;
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
