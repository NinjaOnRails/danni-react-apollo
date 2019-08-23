import React from 'react';
import Link from 'next/link';
import MobileNavStyles from './styles/MobileNavStyles';
import User from './User';
import Signout from './Signout';

const MobileNav = () => (
  <User>
    {({ data }) => {
      const currentUser = data ? data.currentUser : null;
      return (
        <MobileNavStyles data-test="nav">
          <li>
            <button type="button" className="menu">
              MENU
            </button>
            {/* <Icon name="caret down" size="small"/> */}
            <ul>
              <li>
                <Link href="/">
                  <a>HOME</a>
                </Link>
              </li>
              <li>
                <Link href="/new">
                  <a>VIDEO+</a>
                </Link>
              </li>
              <li>
                <Link href="/about">
                  <a>About</a>
                </Link>
              </li>

              {currentUser && (
                <li>
                  <Signout />
                  {/* <Link href="/currentUser">
                <a>
                <span role="img" aria-label="account">
                🤷
                </span>
                </a>
              </Link> */}
                </li>
              )}
              {!currentUser && (
                <>
                  <li>
                    <Link href="/signup">
                      <a>Đăng Ký</a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/signin">
                      <a>Đăng Nhập</a>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </li>
        </MobileNavStyles>
      );
    }}
  </User>
);

export default MobileNav;
