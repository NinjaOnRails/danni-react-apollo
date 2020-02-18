import React from 'react';
import { Icon } from 'semantic-ui-react';
import Link from 'next/link';
import Logo from './Logo';
import FooterStyle from '../styles/FooterStyles';

const pagesWithoutFooter = ['/', '/watch'];

const Footer = () => (
  <FooterStyle>
    <div className="footer-container">
      <ul className="footer-list-top">
        <li className="footer-list-header">
          <Logo footer />
        </li>
        <li>
          <p className="link-list-item">info.dannitv@gmail.com</p>
        </li>
        <li>
          <a
            href="https://www.facebook.com/danni.tvVietnam/"
            className="link-list-item"
            id="facebook-link"
          >
            <Icon name="facebook" size="big" />
          </a>
        </li>
      </ul>
      <ul className="footer-list-top">
        <li>
          <h4 className="footer-list-header">About danni.tv</h4>
        </li>
        <li>
          <Link href="/about">
            <a className="link-list-item">OUR MISSION</a>
          </Link>
        </li>
        <li>
          <a className="link-list-item">PROMOS</a>
        </li>
        <li>
          <a className="link-list-item">DUB A VIDEO</a>
        </li>
      </ul>
      <ul className="footer-list-top">
        <li id="help">
          <h4 className="footer-list-header">Support</h4>
        </li>
        <li>
          <Link href="/about">
            <a className="link-list-item">CONTACT</a>
          </Link>
        </li>
        <li>
          <Link href="/about">
            <a className="link-list-item">FAQ</a>
          </Link>
        </li>
        <li id="find-a-store">
          <Link href="/about">
            <a className="link-list-item">HOW TO</a>
          </Link>
        </li>
      </ul>
      <section className="footer-bottom-section flex-rw">
        <div className="footer-bottom-wrapper">
          &copy; 2019 Danni.tv
          <span className="footer-bottom-rights">
            {' '}
            - All Rights Reserved -{' '}
          </span>
        </div>
        <div className="footer-bottom-wrapper">
          <a className="terms-privacy" rel="nofollow">
            TERMS
          </a>{' '}
          |{' '}
          <a className="terms-privacy" rel="nofollow">
            PRIVACY
          </a>
        </div>
      </section>
    </div>
  </FooterStyle>
);

export default Footer;
export { pagesWithoutFooter };
