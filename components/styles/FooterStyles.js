import styled from 'styled-components';

const FooterStyle = styled.footer`
  font-size: 11px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #1b1c1d;
  margin-top: auto;
  width: 100%;
  display: flex;
  flex-flow: row wrap;

  ul {
    list-style: none;
    padding-left: 5px;
    margin-top: 1.3em;
  }

  a {
    text-decoration: none;
  }

  .flex-rw {
    display: flex;
    flex-flow: row wrap;
  }
  .footer-list-top p {
    display: inline-block;
  }

  .link-list-item {
    color: rgba(255, 255, 255, 0.5);
    font-size: 1em;
    font-family: 'Verdana';
  }

  /* .link-list-item:visited {
    color: #8db9ed;
  } */

  #facebook-link:visited {
    color: rgba(255, 255, 255, 0.5);
  }
  .link-list-item:hover {
    color: rgba(255, 255, 255, 0.9);
  }

  .terms-privacy {
    color: #8db9ed;
  }
  .terms-privacy:visited {
    color: #8db9ed;
  }
  .terms-privacy:hover {
    color: #ccc;
  }

  .footer-list-top {
    width: 33.33%;
  }

  .footer-list-top > li {
    text-align: left;
    padding-bottom: 10px;
  }

  /* .footer-list-top > li:first-child {
    text-align: center;
  } */
  .footer-list-top:first-child > li {
    text-align: center;
  }
  .footer-list-header {
    padding: 10px 0 5px 0;
    color: #fff;
    font-size: 1.5vw;
  }

  .footer-bottom-section {
    width: 100%;
    padding: 10px;
    border-top: 1px solid #ccc;
    margin-top: 10px;
  }

  .footer-bottom-section > div:first-child {
    margin-right: auto;
  }

  .footer-bottom-wrapper {
    font-size: 1em;
    color: #fff;
  }

  @media only screen and (max-width: 768px) {
    .footer-list-header {
      font-size: 2rem;
    }

    .link-list-item {
      font-size: 1.1em;
    }

    .footer-bottom-wrapper {
      font-size: 1.3em;
    }
  }
  @media only screen and (max-width: 568px) {
    main {
      font-size: 5em;
    }

    .footer-list-top {
      width: 100%;
    }

    .link-list-item {
      font-size: 1.5em;
    }

    .footer-social-icons-wrapper {
      width: 100%;
      padding: 0;
    }

    .footer-bottom-section {
      padding: 0 5px 10px 5px;
    }

    .footer-bottom-wrapper {
      text-align: center;
      width: 100%;
      margin-top: 10px;
    }
  }
  @media only screen and (max-width: 480px) {
    .footer-social-overlap > a:not(:first-child) {
      margin-left: 0;
    }

    .footer-bottom-rights {
      display: block;
    }
  }
  @media only screen and (max-width: 320px) {
    .footer-list-header {
      font-size: 2.2em;
    }

    /* .link-list-item {
      font-size: 1.2em;
    } */

    .footer-bottom-wrapper {
      font-size: 1.3em;
    }
  }
`;

export default FooterStyle;
