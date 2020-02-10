import styled from 'styled-components';

export const WatchPageStyles = styled.div`
  display: grid;

  .filePlayer {
    display: none; /* Hide audio File Player */
  }

  div.ui.active.centered.inline.loader {
    margin-top: 50px;
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
    margin: 0 24px;
    .main {
      padding-right: 24px;
    }
  }
`;

export const YoutubeStyle = styled.div`
  position: relative;
  padding-bottom: 56.25%;
  /* Create element on top of Youtube Player to limit interaction */
  :before,
  .next-video-overlay {
    content: '';
    position: absolute;
    height: 78%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    @media (min-width: 793px) {
      position: absolute;
      height: 85%;
    }
  }

  .next-video-overlay {
    height: 90%;
    font-family: ${props => props.theme.font};
    color: white;
    z-index: 800;
    opacity: 1;
    transition: 0.5s ease;
    background-size: cover;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.9);
    text-align: center;

    #next-text {
      padding-top: 30px;
      font-size: 20px;
      font-weight: 400;
      z-index: 801;
      margin: 0;
    }

    #next-title {
      font-size: 25px;
      margin: auto;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      max-width: 70%;
    }
    #thumb-count {
      position: relative;
    }
    #next-count {
      font-size: 30px;
      margin: auto;
      background-color: rgba(0, 0, 0, 0.3);
      height: 60px;
      width: 60px;
      border-radius: 50%;
      z-index: 2000;
      box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.1);
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
    }
    #next-thumbnail {
      height: 150px;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    #next-actions {
      margin: auto;
      display: flex;
      justify-content: space-around;
      width: 50%;
      .ui.button {
        color: white;
        background-color: rgba(225, 225, 225, 0.3);
      }
      .ui.button,
      .ui.buttons .button,
      .ui.buttons .or {
        font-size: 1.5rem;
        position: relative;
      }
    }
    .ui.progress {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      height: 100%;
      width: 100%;
      z-index: -1;
      .bar {
        height: 100%;
        min-width: 0;
      }
    }
    @media (max-width: 479px) {
      #next-text {
        font-size: 15px;
        padding-top: 10px;
      }
      #next-title {
        font-size: 20px;
      }
      #next-count {
        font-size: 20px;
        height: 40px;
        width: 40px;
      }
      #next-thumbnail {
        max-height: 75px;
      }
      #next-actions {
        .ui.button,
        .ui.buttons .button,
        .ui.buttons .or {
          font-size: 1rem;
        }
      }
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
