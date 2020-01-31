import NProgress from 'nprogress';
import Router from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { Icon, Button } from 'semantic-ui-react';
import Logo from './Logo';
import Search from './Search';
import User from '../Authentication/User';
import Signout from '../Authentication/Signout';

const StyledHeader = styled.header`
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 70px;
  box-sizing: border-box;
  position: relative;

  .bar {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    position: relative;
  }

  .nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 5px;

    ul {
      display: flex;
      padding: 0;
      li {
        margin-left: auto;
        padding: 10px 20px;
        list-style: none;
        &:first-child {
          margin-left: 20px;
        }

        a,
        button {
          margin: 0;
          padding: 0;
          border: 0;
          display: flex;
          align-items: center;
          text-align: center;
          line-height: normal;
          position: relative;
          background: none;
          border: 0;
          cursor: pointer;
          color: ${props => props.theme.black};

          &:after {
            height: 2px;
            background: red;
            content: '';
            width: 0;
            position: absolute;
            transform: translateX(-50%);
            transition-property: width;
            transition-duration: 0.4s;
            transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
            -webkit-transform: translateX(-50%);
            -webkit-transition-property: width;
            -webkit-transition-duration: 0.4s;
            -webkit-transition-timing-function: cubic-bezier(1, -0.65, 0, 2.31);
            transform-style: preserve-3d;
            backface-visibility: hidden;
            -webkit-transform-style: preserve-3d;
            -webkit-backface-visibility: hidden;
            left: 50%;
            margin-top: 1.5rem;
          }

          &:hover,
          &:focus {
            outline: none;
            &:after {
              width: 100%;
            }
          }
        }
      }

      .signup {
        border: 1px solid rgba(255, 0, 0, 0.5);
        margin: -1px 0;
        outline: 0px;
        border-radius: 3px;
        font-weight: bold;
        align-items: center;
        text-align: center;
        justify-content: center;

        &:hover {
          border-color: rgba(255, 0, 0);
        }

        a {
          &:after {
            content: none;
          }
        }
        /* line-height: 5px; */
      }
    }
  }

  .tools {
    display: flex;
  }

  @media (max-width: 639px) {
    margin-bottom: 10px;
    z-index: 99;
    justify-content: center;
    height: 35px;
    .bar {
      display: none;
    }
  }
`;
Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};

Router.onRouteChangeError = () => {
  NProgress.done();
};

const Header = () => (
  <StyledHeader>
    <Logo />

    <User>
      {({ data }) => {
        const currentUser = data ? data.currentUser : null;
        return (
          <div className="bar" data-test="nav">
            <div className="nav">
              <ul>
                <li>
                  <Link href="/">
                    <a>Trang chủ</a>
                  </Link>
                </li>

                <li>
                  <Link href="/about">
                    <a>Giới thiệu</a>
                  </Link>
                </li>

                {currentUser ? (
                  <>
                    <li>
                      <Link href="/me">
                        <a>Tài khoản</a>
                      </Link>
                    </li>
                    <li>
                      <Signout />
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link href="/signin">
                        <a>Đăng Nhập</a>
                      </Link>
                    </li>
                    <li className="signup">
                      <Link href="/signup">
                        <a>Đăng Ký</a>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div className="tools">
              {/* <Search /> */}
              <Link href="/new">
                <Button primary size="huge">
                  <Icon name="plus" /> Thêm Video
                </Button>
              </Link>
            </div>
          </div>
        );
      }}
    </User>
  </StyledHeader>
);

export default Header;
