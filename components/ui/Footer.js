import React from 'react';
import { Icon } from 'semantic-ui-react';
import Logo from './Logo';
import FooterStyle from '../styles/FooterStyles';

const Footer = () => (
  <FooterStyle>
    <ul className="footer-list-top">
      <li className="footer-list-header">
        <Logo footer />
      </li>
      <li>
        <p className="link-list-item">info@dannitv@gmail.com</p>
      </li>
      <li>
        <a
          href="https://www.facebook.com/danni.tvVietnam/"
          className="link-list-item"
        >
          <Icon name="facebook" size="big" />
        </a>
      </li>
    </ul>
    <ul className="footer-list-top">
      <li>
        <h4 className="footer-list-header">Về danni.tv</h4>
      </li>
      <li>
        <a href="/about" className="link-list-item">
          MỤC ĐÍCH CỦA CHÚNG TÔI
        </a>
      </li>
      <li>
        <a href="/about" className="link-list-item">
          PROMOS
        </a>
      </li>
      <li>
        <a href="/about" className="link-list-item">
          THUYẾT MINH VIDEO
        </a>
      </li>
    </ul>
    <ul className="footer-list-top">
      <li id="help">
        <h4 className="footer-list-header">Trợ giúp</h4>
      </li>
      <li>
        <a href="/about" className="link-list-item">
          LIÊN LẠC
        </a>
      </li>
      <li>
        <a href="/about" className="link-list-item">
          FAQ
        </a>
      </li>
      <li id="find-a-store">
        <a href="/about" className="link-list-item">
          HƯỚNG DẪN SỬ DỤNG
        </a>
      </li>
    </ul>
    <section className="footer-bottom-section flex-rw">
      <div className="footer-bottom-wrapper">
        &copy; 2019 Danni.tv
        <span className="footer-bottom-rights"> - All Rights Reserved </span>
      </div>
      <div className="footer-bottom-wrapper">
        <a href="/about" className="terms-privacy" rel="nofollow">
          ĐIỀU KHOẢN
        </a>{' '}
        |{' '}
        <a href="/about" className="terms-privacy" rel="nofollow">
          QUYỀN RIÊNG TƯ
        </a>
      </div>
    </section>
  </FooterStyle>
);

export default Footer;
